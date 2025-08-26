/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { Setting } from "./admin.setting";

/** Admin Dashboard Overview */
export const adminOverviewSvc = async () => {
  const [totalUsers, totalAgents, totalTransactions, volumeAgg] = await Promise.all([
    User.countDocuments({ role: "USER" }),
    User.countDocuments({ role: "AGENT" }),
    Transaction.countDocuments({}),
    Transaction.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    totalUsers,
    totalAgents,
    totalTransactions,
    totalVolume: volumeAgg?.[0]?.total || 0,
  };
};

/** List Users */
export const listUsersSvc = async (q: any) => {
  const { page, limit, skip } = q.pagination;
  const text = (q.q as string)?.trim();
  const filter: any = {};
  if (typeof q.isBlocked !== "undefined") filter.isBlocked = q.isBlocked === "true";

  if (text) {
    filter.$or = [
      { name: { $regex: text, $options: "i" } },
      { email: { $regex: text, $options: "i" } },
      { phone: { $regex: text, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return { data, meta: { total, page, limit } };
};

/** Toggle User Status */
export const toggleUserStatusSvc = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  user.isBlocked = !user.isBlocked;
  await user.save();
  return { _id: user._id, isBlocked: user.isBlocked };
};

/** List Agents */
export const listAgentsSvc = async (q: any) => {
  const { page, limit, skip } = q.pagination;
  const filter: any = { role: "AGENT" };
  if (q.status) filter.agentStatus = q.status;

  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return { data, meta: { total, page, limit } };
};

/** Toggle Agent Status */
export const toggleAgentStatusSvc = async (id: string) => {
  const agent = await User.findById(id);
  if (!agent) throw new Error("Agent not found");
  if (agent.role !== "AGENT") throw new Error("Not an agent");
  agent.agentStatus = agent.agentStatus === "approved" ? "suspended" : "approved";
  await agent.save();
  return { _id: agent._id, status: agent.agentStatus };
};

/** List Transactions */
export const listTransactionsSvc = async (filters: any, pagination: any) => {
  const { skip, limit, page } = pagination;

  const [data, total] = await Promise.all([
    Transaction.find(filters)
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .populate("agent", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(filters),
  ]);

  return { data, meta: { total, page, limit } };
};

/** Get Settings */
export const getSettingSvc = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
};

/** Update Settings */
export const updateSettingSvc = async (payload?: Partial<{ transactionFee: number; minLimit: number; maxLimit: number }>) => {
  if (!payload) throw new Error("Payload is required");

  const s = await getSettingSvc();

  if (typeof payload.transactionFee === "number") s.transactionFee = payload.transactionFee;
  if (typeof payload.minLimit === "number") s.minLimit = payload.minLimit;
  if (typeof payload.maxLimit === "number") s.maxLimit = payload.maxLimit;

  await s.save();
  return s;
};


/** Update Admin Profile */
export const updateAdminProfileSvc = async (
  adminId: string,
  payload: Partial<{ name: string; phone: string; password: string }>
) => {
  const admin = await User.findById(adminId);
  if (!admin) throw new Error("Admin not found");

  if (payload.name != null) admin.name = payload.name;
  if (payload.phone != null) admin.phone = payload.phone;
  if (payload.password != null) {
    // TODO: hash password according to your auth system
    admin.password = payload.password;
  }

  await admin.save();
  return { _id: admin._id, name: admin.name, phone: admin.phone, email: admin.email };
};

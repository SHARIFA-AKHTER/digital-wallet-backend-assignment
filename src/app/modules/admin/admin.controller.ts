/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from "express";

import {
  adminOverviewSvc,
  listUsersSvc,
  toggleUserStatusSvc,
  listAgentsSvc,
  toggleAgentStatusSvc,
  listTransactionsSvc,
  getSettingSvc,
  updateSettingSvc,
  updateAdminProfileSvc,
} from "./admin.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { getPagination } from "../../utils/pagination";
import { buildTransactionFilters } from "../../utils/adminFilters";

export const getAdminOverview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminOverviewSvc();
  res.json({ success: true, message: "Admin overview", data });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query);
  const data = await listUsersSvc({ ...req.query, pagination });
  res.json({ success: true, message: "Users fetched", ...data });
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = await toggleUserStatusSvc(req.params.id);
  res.json({ success: true, message: "User status toggled", data });
});

export const getAllAgents = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query);
  const data = await listAgentsSvc({ ...req.query, pagination });
  res.json({ success: true, message: "Agents fetched", ...data });
});

export const toggleAgentStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = await toggleAgentStatusSvc(req.params.id);
  res.json({ success: true, message: "Agent status toggled", data });
});

export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query);
  const filters = buildTransactionFilters(req.query);
  const data = await listTransactionsSvc(filters, pagination);
  res.json({ success: true, message: "Transactions fetched", ...data });
});

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getSettingSvc();
  res.json({ success: true, message: "Settings fetched", data });
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const data = await updateSettingSvc(req.body);
  res.json({ success: true, message: "Settings updated", data });
});

export const updateProfile = asyncHandler(async (req: any, res: Response) => {
 
  const adminId = req.user?.id;
  const data = await updateAdminProfileSvc(adminId, req.body);
  res.json({ success: true, message: "Profile updated", data });
});

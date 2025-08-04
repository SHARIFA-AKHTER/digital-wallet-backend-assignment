/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { User } from "../user/user.model";


// Get all pending agents
export const getPendingAgents = async (req: Request, res: Response) => {
  try {
    const pendingAgents = await User.find({ role: "AGENT", isActive: "PENDING" }).select("-password");
    res.json({ success: true, data: pendingAgents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch pending agents" });
  }
};

// Approve agent
export const approveAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    await User.findByIdAndUpdate(agentId, { isActive: "ACTIVE" });
    res.json({ success: true, message: "Agent approved successfully" });
  } catch (error) {
     console.error("Error approving agent:", error);
    res.status(500).json({ success: false, message: "Failed to approve agent" });
  }
};

// Reject (suspend) agent
export const rejectAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    await User.findByIdAndUpdate(agentId, { isActive: "SUSPENDED" });
    res.json({ success: true, message: "Agent rejected successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reject agent" });
  }
};

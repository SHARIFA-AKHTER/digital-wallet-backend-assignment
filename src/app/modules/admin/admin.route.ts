import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth" 
import {
  getAdminOverview,
  getAllUsers,
  toggleUserStatus,
  getAllAgents,
  toggleAgentStatus,
  getAllTransactions,
  getSettings,
  updateSettings,
  updateProfile,
} from "./admin.controller";

const router = Router();

// 🔐 Only ADMIN
router.use(checkAuth("ADMIN","AGENT","USER"));

// Overview
router.get("/overview", getAdminOverview);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/toggle", toggleUserStatus);

// Agents
router.get("/agents", getAllAgents);
router.patch("/agents/:id/toggle", toggleAgentStatus);

// Transactions (with filters/pagination)
router.get("/transactions", getAllTransactions);

// System Settings (optional)
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// Admin Profile Update
router.patch("/profile", updateProfile);

export const adminRoutes = router;

import { Router } from "express";
import { approveAgent, getPendingAgents, rejectAgent } from "./agentController";
import { Role } from "../user/user.interface";  // Adjust path as needed
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// Admin-only routes
router.use(checkAuth(Role.USER,Role.AGENT));

// Get all pending agents
router.get("/pending", getPendingAgents);

// Approve agent by id
router.patch("/approve/:id", approveAgent);

// Reject (suspend) agent by id
router.patch("/reject/:id", rejectAgent);

export const agentRoutes = router;


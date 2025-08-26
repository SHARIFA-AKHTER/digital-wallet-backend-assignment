import express from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface"; // ✅ IMPORT ROLE ENUM

export const transactionRoutes = express.Router();

transactionRoutes.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT,Role.ADMIN), 
  TransactionController.getMyTransactions
);

transactionRoutes.get(
  "/",
  checkAuth(Role.USER,Role.AGENT,Role.ADMIN), 
  TransactionController.getAllTransactions
);
transactionRoutes.post(
  "/",
  checkAuth(Role.USER,Role.AGENT,Role.ADMIN), 
  TransactionController.createTransaction
);

transactionRoutes.post(
  "/cash-in",
  checkAuth(Role.AGENT,Role.USER,Role.ADMIN),
  TransactionController.cashIn
);

transactionRoutes.post(
  "/cash-out",
  checkAuth(Role.AGENT,Role.USER,Role.ADMIN),
  TransactionController.cashOut
);
transactionRoutes.get(
  "/agent-commissions",
  checkAuth(Role.USER,Role.AGENT,Role.ADMIN),
  TransactionController.getAgentCommissions
);

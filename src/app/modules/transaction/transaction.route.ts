import express from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface"; // ✅ IMPORT ROLE ENUM

export const transactionRoutes = express.Router();

transactionRoutes.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT), 
  TransactionController.getMyTransactions
);

transactionRoutes.get(
  "/",
  checkAuth(Role.ADMIN), 
  TransactionController.getAllTransactions
);


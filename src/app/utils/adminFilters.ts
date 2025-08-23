/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/adminFilters.ts

import { FilterQuery } from "mongoose";
import { IUser } from "../modules/user/user.interface";
import { ITransaction } from "../modules/transaction/transaction.interface";

interface IUserFilter {
  role?: "user" | "agent" | "admin";
  status?: "active" | "blocked" | "pending" | "suspended";
  email?: string;
}

interface ITransactionFilter {
  type?: "add-money" | "send-money" | "withdraw" | "payment";
  status?: "pending" | "success" | "failed";
  minAmount?: number;
  maxAmount?: number;
  fromDate?: string;
  toDate?: string;
}

/**
 * 🔹 Convert query params into User filter for Mongo
 */
export const buildUserFilters = (query: any): FilterQuery<IUser> => {
  const filters: FilterQuery<IUser> = {};

  if (query.role) filters.role = query.role;
  if (query.status) filters.status = query.status;
  if (query.email) filters.email = { $regex: query.email, $options: "i" };

  return filters;
};

/**
 * 🔹 Convert query params into Transaction filter for Mongo
 */
export const buildTransactionFilters = (
  query: any
): FilterQuery<ITransaction> => {
  const filters: FilterQuery<ITransaction> = {};

  if (query.type) filters.type = query.type;
  if (query.status) filters.status = query.status;

  if (query.minAmount || query.maxAmount) {
    filters.amount = {};
    if (query.minAmount) filters.amount.$gte = Number(query.minAmount);
    if (query.maxAmount) filters.amount.$lte = Number(query.maxAmount);
  }

  if (query.fromDate || query.toDate) {
    filters.createdAt = {};
    if (query.fromDate) filters.createdAt.$gte = new Date(query.fromDate);
    if (query.toDate) filters.createdAt.$lte = new Date(query.toDate);
  }

  return filters;
};

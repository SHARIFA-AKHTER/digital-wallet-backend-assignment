// src/interfaces/admin.interface.ts

import { ITransaction } from "../transaction/transaction.interface";
import { IUser } from "../user/user.interface";



export interface IAdminOverview {
  totalUsers: number;
  totalAgents: number;
  totalTransactions: number;
  totalVolume: number;
}

// 🔹 Manage Users
export interface IManageUser extends IUser {
  blocked: boolean;
}

// 🔹 Manage Agents
export interface IManageAgent extends IUser {
  status: "pending" | "approved" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

// 🔹 Admin Transaction (with fee field)
export interface IAdminTransaction extends ITransaction {
  fee: number; 
}

// 🔹 System Settings (Optional Config)
export interface ISystemSettings {
  transactionFee: number; 
  maxLimit: number;       
  minLimit: number;      
}

// 🔹 Pagination Response
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface IAgentListResponse {
  data: IManageAgent[];
  meta: IPaginationMeta;
}

export enum Role {
  USER = "USER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export enum IsActive {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive?: IsActive;
  isDeleted?: boolean;
  avatar?: string;
  agentStatus?: string;
  isBlocked?: boolean;
  phone?: string;
  commissionRate?: number;
}


export enum Role {
  USER = "USER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export enum IsActive {
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
}

// import { User } from "./user.model";
// import { IUser } from "./user.interface";
// import AppError from "../../errorHelpers/AppError";
// import httpStatus from "http-status-codes";

// // const createUser = async (userData: Partial<IUser>) => {
// //   const user = new User(userData);
// //   await user.save();
// //   return user;
// // };

// import bcrypt from "bcrypt";

// export const createUser = async (userData: IUser) => {

//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

//   const newUser = await User.create({
//     ...userData,
//     password: hashedPassword,
//     role: userData.role || "USER", // default role
//     isActive: "ACTIVE",
//     isDeleted: false,
//   });

//   return newUser;
// };

// const getAllUsers = async (): Promise<IUser[]> => {
//   return await User.find({ isDeleted: false });
// };

// const getUserById = async (id: string): Promise<IUser | null> => {
//   return await User.findById(id);
// };

// const updateUserProfile = async (
//   id: string,
//   updateData: Partial<IUser>
// ): Promise<IUser | null> => {
//   const user = await User.findById(id);
//   if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

//   Object.assign(user, updateData);
//   return await user.save();
// };

// const softDeleteUser = async (id: string): Promise<void> => {
//   const user = await User.findById(id);
//   if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

//   user.isDeleted = true;
//   await user.save();
// };

// export const UserServices = {
//   createUser,
//   getAllUsers,
//   getUserById,
//   updateUserProfile,
//   softDeleteUser,
// };

import { User } from "./user.model";
import { IUser } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";

export const createUser = async (userData: IUser) => {

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    role: userData.role || "USER", // default role
    isActive: "ACTIVE",
    isDeleted: false,
  });

  return newUser;
};

/**
 * Get all users (excluding soft-deleted ones)
 */
const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find({ isDeleted: false });
};

/**
 * Get a user by ID (used for /me and admin lookup)
 */
const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id);
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

/**
 * Update current user profile
 */
const updateUserProfile = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  const user = await User.findById(id);
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  Object.assign(user, updateData);
  return await user.save();
};

/**
 * Soft delete a user profile (not actual deletion)
 */
const softDeleteUser = async (id: string): Promise<void> => {
  const user = await User.findById(id);
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isDeleted = true;
  await user.save();
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserProfile,
  softDeleteUser,
};

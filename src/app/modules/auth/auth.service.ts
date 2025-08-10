/* eslint-disable @typescript-eslint/no-non-null-assertion */

import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { generateToken } from "../../utils/jwt";
import { IsActive, Role } from "../user/user.interface";

interface IUserRegister {
  name: string;
  email: string;
  password: string;
  role: "AGENT" | "USER" | "ADMIN";
  isActive: "PENDING" | "ACTIVE" | "SUSPENDED";
  commissionRate?: number;
}

// export const registerUser = async (userData: IUserRegister) => {
//   const existing = await User.findOne({ email: userData.email });
//   if (existing) {
//     throw new Error("User already exists");
//   }

//   const hashedPassword = await bcrypt.hash(userData.password, 10);

//   const newUser = await User.create({
//     name: userData.name,
//     email: userData.email,
//     password: hashedPassword,
//     role: userData.role || Role.USER,
//     isActive: userData.isActive || IsActive.PENDING,
//       commissionRate:
//       userData.role === "AGENT" ? userData.commissionRate ?? 0 : undefined, 
//   });
 
//   // await Wallet.create({
//   //   user: newUser._id,
//   //   balance: 50,
//   // });
//   await Wallet.create({
//     user: newUser._id,
//     balance: 0,
//     isBlocked: false,
//   });

//   const accessToken = generateToken(
//     {
//       userId: newUser._id.toString(),
//       role: newUser.role,
//       email: newUser.email,
//     },
//     process.env.JWT_ACCESS_SECRET!,
//     process.env.JWT_ACCESS_EXPIRES || "15d"
//   );

//   const refreshToken = generateToken(
//     {
//       userId: newUser._id.toString(),
//       role: newUser.role,
//       email: newUser.email,
//     },
//     process.env.JWT_REFRESH_SECRET!,
//     process.env.JWT_REFRESH_EXPIRES || "30d"
//   );

//   return { accessToken, refreshToken, user: newUser };
// };


export const registerUser = async (userData: IUserRegister) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);


  let role: Role;
  if (userData.role && ["ADMIN", "USER", "AGENT"].includes(userData.role.toUpperCase())) {
    role = userData.role.toUpperCase() as Role;
  } else {
    role = Role.USER;
  }

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role,
    isActive: userData.isActive || IsActive.PENDING,
    commissionRate: role === Role.AGENT ? userData.commissionRate ?? 0 : undefined,
  });

  await Wallet.create({
    user: newUser._id,
    balance: 0,
    isBlocked: false,
  });

  const accessToken = generateToken(
    {
      userId: newUser._id.toString(),
      role: newUser.role,
      email: newUser.email,
    },
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRES || "15d"
  );

  const refreshToken = generateToken(
    {
      userId: newUser._id.toString(),
      role: newUser.role,
      email: newUser.email,
    },
    process.env.JWT_REFRESH_SECRET!,
    process.env.JWT_REFRESH_EXPIRES || "30d"
  );

  return { accessToken, refreshToken, user: newUser };
};


const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password as string);
  if (!isMatch)
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");

  user.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  await user.save();
};

export const AuthServices = {
  registerUser,
  getNewAccessToken,
  resetPassword,
};

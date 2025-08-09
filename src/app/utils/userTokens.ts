

import { User } from "../modules/user/user.model";
import { IsActive, IUser } from "../modules/user/user.interface";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";

/**
 * Create access & refresh tokens
 */
export const createUserToken = (user: Partial<IUser>) => {
  const JwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    JwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    JwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return { accessToken, refreshToken };
};

/**
 * Generate new access token using refresh token
 */
export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
): Promise<string> => {
  const decoded = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);

  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (user.isActive === IsActive.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.isActive}`);
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};

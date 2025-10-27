/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";
import { AuthServices, registerUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userTokens";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser, Role } from "../user/user.interface";
import { HydratedDocument } from "mongoose";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  let finalRole: Role;

  if (email === process.env.SUPER_ADMIN_EMAIL) {
  finalRole = Role.ADMIN;
} else if (role?.toUpperCase() === Role.AGENT) {
  finalRole = Role.AGENT;
} else if (role?.toUpperCase() === Role.ADMIN) {
  finalRole = Role.ADMIN;
} else {
  finalRole = Role.USER;
}

  const { accessToken, refreshToken, user } = await registerUser({
    name,
    email,
    password,
    role: finalRole,
    isActive: IsActive.PENDING,
  });

  res.status(201).json({
    message: "User registered successfully",
    accessToken,
    refreshToken,
    user,
  });
});


const credentialsLogin = (req: Request, res: Response, next: NextFunction) => {
  
  passport.authenticate(
    "local",
    async (err: any, user: HydratedDocument<IUser> | null, info: any) => {
      try {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message || "Server Error" });
        }

        if (!user) {
          return res
            .status(401)
            .json({ success: false, message: info?.message || "Login failed" });
        }

        const tokens = await createUserToken(user);

        const { password, ...restUser } = user.toObject();

        let filteredUserData;

        if (user.role === Role.ADMIN) {
          filteredUserData = {
            _id: restUser._id,
            name: restUser.name,
            email: restUser.email,
            role: restUser.role,
          };
        } else if (user.role === Role.AGENT) {
          filteredUserData = {
            _id: restUser._id,
            name: restUser.name,
            email: restUser.email,
            role: restUser.role,
            commissionRate: restUser.commissionRate || 0,
          };
        } else {
          filteredUserData = {
            _id: restUser._id,
            name: restUser.name,
            email: restUser.email,
            role: restUser.role,
          };
        }

        setAuthCookie(res, tokens);

        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          data: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: filteredUserData,
          },
        });
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh token found in cookies"
    );
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token refreshed",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", { httpOnly: true, secure: false });
  res.clearCookie("refreshToken", { httpOnly: true, secure: false });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged out successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user;

  await AuthServices.resetPassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: null,
  });
});

const googleCallbackController = catchAsync(
  async (req: Request, res: Response) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) redirectTo = redirectTo.slice(1);

    const user = req.user;
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User Not Found");

    const typedUser: Partial<IUser> = {
      ...user,
      role: user.role as Role,
    };
    const tokenInfo = createUserToken(typedUser);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${"https://digital-wallet-api-client.vercel.app"}/${redirectTo}`);
  }
);

export const AuthControllers = {
  register,
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};

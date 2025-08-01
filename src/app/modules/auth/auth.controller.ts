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
import { IUser } from "../user/user.interface";
import { HydratedDocument } from "mongoose";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const { accessToken, refreshToken, user } = await registerUser({ name, email, password, role });

  res.status(201).json({
    message: "User registered successfully",
    accessToken,
    refreshToken,
    user,
  });
})


// const credentialsLogin = (req: Request, res: Response, next: NextFunction) => {
//   passport.authenticate("local", async (err: any, user: Partial<IUser>, info: any) => {
//     try {
//       if (err) {
//         return res.status(500).json({ success: false, message: err.message || "Server Error" });
//       }

//       if (!user) {
//         return res.status(401).json({ success: false, message: info?.message || "Login failed" });
//       }

//       const tokens = await createUserToken(user);
//       const userObj = typeof user.toObject === "function" ? user.toObject() : user;
//       const { password, ...userData } = userObj;

//       setAuthCookie(res, tokens);

//       return res.status(200).json({
//         success: true,
//         message: "User logged in successfully",
//         data: {
//           accessToken: tokens.accessToken,
//           refreshToken: tokens.refreshToken,
//           user: userData,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   })(req, res, next);
// };


const credentialsLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", async (err: any, user: HydratedDocument<IUser> | null, info: any) => {
    try {
      if (err) {
        return res.status(500).json({ success: false, message: err.message || "Server Error" });
      }

      if (!user) {
        return res.status(401).json({ success: false, message: info?.message || "Login failed" });
      }

      const tokens = await createUserToken(user);
      const userObj = user.toObject();
      const { password, ...userData } = userObj;

      setAuthCookie(res, tokens);

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: userData,
        },
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No refresh token found in cookies");
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

  await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: null,
  });
});

const googleCallbackController = catchAsync(async (req: Request, res: Response) => {
  let redirectTo = req.query.state ? (req.query.state as string) : "";
  if (redirectTo.startsWith("/")) redirectTo = redirectTo.slice(1);

  const user = req.user;
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User Not Found");

  const tokenInfo = await createUserToken(user);
  setAuthCookie(res, tokenInfo);

  res.redirect(`${process.env.FRONTEND_URL}/${redirectTo}`);
});

export const AuthControllers = {
  register,
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};

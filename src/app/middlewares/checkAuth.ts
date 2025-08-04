
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      console.log("🔐 Auth header from client:", authHeader);

      // ✅ Check if Authorization header exists and valid
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized: No token found");
      }

      const token = authHeader.split(" ")[1];

      // ✅ Decode and verify JWT token
      const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;

      // ✅ Store the decoded user data in req.user
      req.user = decoded;

       console.log("🕵️‍♂️ Checking role:", decoded.role, "against allowed:", allowedRoles);
      // ✅ Optional: Check if user exists in DB and is active
      const existingUser = await User.findOne({ email: decoded.email });

      if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
      }

      if (existingUser.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.FORBIDDEN, `User is ${existingUser.isActive}`);
      }

      if (existingUser.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "User account is deleted");
      }

      const userRole = decoded.role?.trim().toUpperCase() ;
      console.log("🕵️‍♂️ Checking role:", userRole, "against allowed:", allowedRoles); 

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(httpStatus.FORBIDDEN, "Access denied: Invalid role");
      }
      
      // if (!allowedRoles.includes(decoded.role?.trim())) {
      //   throw new AppError(httpStatus.FORBIDDEN, "Access denied: Invalid role");
      // }

      next();
    } catch (error) {
      next(error);
    }
  };


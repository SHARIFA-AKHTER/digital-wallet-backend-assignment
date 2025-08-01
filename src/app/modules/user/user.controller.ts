/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "./user.model";


const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: users,
  });
});


const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.getUserById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User fetched successfully",
    data: user,
  });
});

const getLoggedInUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string };
  const userData = await UserServices.getUserById(user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile fetched successfully",
    data: userData,
  });
});


const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as { userId: string };
  const userId = decodedUser?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized: No user id found");
  }


  if (req.body.email) {
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists && emailExists._id.toString() !== userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Email already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});



const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string };
  const userId = user.userId;
  await UserServices.softDeleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile deleted successfully",
    data: null,
  });
});

export const UserControllers = {
  getAllUsers,
  getUserById,
  getLoggedInUser,
  updateProfile,
  deleteProfile,
};

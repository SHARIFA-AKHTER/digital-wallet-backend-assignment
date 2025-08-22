/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from 'express';
// import httpStatus from 'http-status-codes';
// import { WalletService } from './wallet.service';
// import AppError from '../../errorHelpers/AppError';

// export const WalletController = {
//   async getMyWallet(req: Request, res: Response) {
//     try {
//       const userId = req.user?.userId;
//       const wallet = await WalletService.getWalletByUserId(userId);
//       res.status(httpStatus.OK).json({
//         success: true,
//         message: "Wallet retrieved successfully",
//         data: wallet,
//       });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       res.status(err.statusCode || httpStatus.BAD_REQUEST).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   },

//   async addMoney(req: Request, res: Response) {
        
//     try {
//       console.log("Request body:", req.body);
//       const userId = req.user?.userId;
//       const { amount } = req.body;

//       if (!amount || amount <= 0) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount');
//       }

//       const wallet = await WalletService.addMoney(userId, amount);
//       res.status(httpStatus.OK).json({
//         success: true,
//         message: "Money added successfully",
//         data: wallet,
//       });
//     } catch (err: any) {
//       res.status(err.statusCode || httpStatus.BAD_REQUEST).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   },

//   async withdrawMoney(req: Request, res: Response) {
//     try {
//       const userId = req.user?.userId;
//       const { amount } = req.body;

//       if (!amount || amount <= 0) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount');
//       }

//       const wallet = await WalletService.withdrawMoney(userId, amount);
//       res.status(httpStatus.OK).json({
//         success: true,
//         message: "Money withdrawn successfully",
//         data: wallet,
//       });
//     } catch (err: any) {
//       res.status(err.statusCode || httpStatus.BAD_REQUEST).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   },
// };


import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { WalletService } from "./wallet.service";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "./wallet.model";

export const WalletController = {
  async getMyWallet(req: Request, res: Response) {
    try {
      console.log("🔥 req.user:", req.user);
      const userId = (req.user as any)?.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found in request",
        });
      }

      const wallet = await WalletService.getWalletByUserId(userId);

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Wallet retrieved successfully",
        data: wallet,
      });
    } catch (err: any) {
      return res.status(err.statusCode || httpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
  },

  async addMoney(req: Request, res: Response) {
    try {
       console.log("User from req:", req.user);
      console.log("Request body:", req.body);
      const userId = (req.user as any)?.userId as string;
      const { amount } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found in request",
        });
      }

      if (!amount || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
      }

      const wallet = await WalletService.addMoney(userId, amount);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Money added successfully",
        data: wallet,
      });
    } catch (err: any) {
      return res.status(err.statusCode || httpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
  },


  async sendMoney(req: Request, res: Response) {
    try {
      const senderId = (req.user as any)?.userId;
      const { receiverId, amount } = req.body;

      if (!senderId) {
        return res.status(400).json({ success: false, message: "Sender not found" });
      }

      const result = await WalletService.sendMoney(senderId, receiverId, amount);

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Money sent successfully",
        data: result,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  },
  async withdrawMoney(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.userId as string;
      const { amount } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found in request",
        });
      }

      if (!amount || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
      }

      const wallet = await WalletService.withdrawMoney(userId, amount);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Money withdrawn successfully",
        data: wallet,
      });
    } catch (err: any) {
      return res.status(err.statusCode || httpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
  },
};

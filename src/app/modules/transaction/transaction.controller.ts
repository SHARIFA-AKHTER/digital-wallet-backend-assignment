/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { WalletService } from "../wallet/wallet.service";

export const TransactionController = {
  // ✅ CREATE transaction (SEND money)
  async createTransaction(req: Request, res: Response) {
    try {
      const user = req.user as { userId: string };
      const { toUserId, amount } = req.body;

      // Validate receiver
      const receiver = await User.findById(toUserId);
      if (!receiver) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Receiver user not found",
        });
      }

      // ✅ Get receiver's wallet
      const receiverWallet = await Wallet.findOne({ user: toUserId });
      if (!receiverWallet) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Receiver wallet not found",
        });
      }

      // ✅ Create the transaction
      const transaction = await TransactionService.createTransaction({
        walletId: receiverWallet._id.toString(),
        type: "send",
        amount,
        fromUser: user.userId,
        toUser: toUserId,
        status: "completed",
      });

      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },


   // ✅ AGENT Cash-In: Add money to user wallet
  // ✅ AGENT Cash-In: Add money to user wallet
async cashIn(req: Request, res: Response) {
  try {
    const agent = req.user as { userId: string };
    const { userId, amount } = req.body;

    const userWallet = await WalletService.findWalletByUserId(userId);
    if (!userWallet || userWallet.isBlocked) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Target user's wallet is not active or not found",
      });
    }

    // update user balance
    await WalletService.increaseBalance(userWallet._id, amount);

    // ✅ Debug log before transaction creation
    console.log("Creating CashIn Transaction with data:", {
      walletId: userWallet._id,
      type: "cashIn",
      amount,
      fromUser: agent.userId,
      toUser: userId,
      status: "completed",
    });

    // create transaction
    const transaction = await TransactionService.createTransaction({
      walletId: userWallet._id.toString(),
      type: "cashIn",
      amount,
      fromUser: agent.userId,
      toUser: userId,
      status: "completed",
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Cash-in successful",
      data: transaction,
    });
  } catch (error: any) {
    console.error("Cash-In Error:", error); // ✅ Optional: for server error debug
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
},

async cashOut(req: Request, res: Response) {
    try {
      const agent = req.user as { userId: string };
      const { userId, amount } = req.body;

      const userWallet = await WalletService.findWalletByUserId(userId);
      if (!userWallet || userWallet.isBlocked) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Target user's wallet is not active or not found",
        });
      }

      // Check sufficient balance
      if (userWallet.balance < amount) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Insufficient balance in user's wallet",
        });
      }

      // update user balance
      await WalletService.decreaseBalance(userWallet._id, amount);

      // create transaction
      const transaction = await TransactionService.createTransaction({
        walletId: userWallet._id.toString(),
        type: "cashOut",
        amount,
        fromUser: agent.userId,
        toUser: userId,
        status: "completed",
      });

      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Cash-out successful",
        data: transaction,
      });
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },
  // ✅ GET my transactions
  async getMyTransactions(req: Request, res: Response) {
    try {
      const user = req.user as { userId: string };
      if (!user?.userId) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: User not found in request",
        });
      }

      const transactions = await TransactionService.getTransactionsByUser(user.userId);

      res.status(httpStatus.OK).json({
        success: true,
        message: "Transactions fetched successfully",
        data: transactions,
      });
    } catch (err: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  },

  // ✅ GET all transactions (admin)
  async getAllTransactions(req: Request, res: Response) {
    try {
      const transactions = await TransactionService.getAllTransactions();
      res.status(httpStatus.OK).json({
        success: true,
        message: "All transactions fetched successfully",
        data: transactions,
      });
    } catch (err: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  },
};


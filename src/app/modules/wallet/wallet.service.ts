import { Wallet } from "./wallet.model";
import mongoose, { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const WalletService = {
  async getWalletByUserId(userId: string) {
    const wallet = await Wallet.findOne({ user: new Types.ObjectId(userId) });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    return wallet;
  },

  async addMoney(userId: string, amount: number) {
    const wallet = await Wallet.findOne({ user: new Types.ObjectId(userId) });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    if (wallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Wallet is blocked");
    }

    wallet.balance += amount;
    await wallet.save();
    return wallet;
  },

  async findWalletByUserId(userId: string) {
    console.log("userId value in findWalletByUserId:", userId);

    return Wallet.findOne({ user: new Types.ObjectId(userId)  });
    
  },

  async increaseBalance(walletId: mongoose.Types.ObjectId, amount: number) {
    return Wallet.findByIdAndUpdate(
      walletId,
      { $inc: { balance: amount } },
      { new: true }
    );
  },

  async decreaseBalance(walletId: mongoose.Types.ObjectId, amount: number) {
    return Wallet.findByIdAndUpdate(
      walletId,
      { $inc: { balance: -amount } },
      { new: true }
    );
  },
  async withdrawMoney(userId: string, amount: number) {
    const wallet = await Wallet.findOne({ user: new Types.ObjectId(userId) });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    if (wallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Wallet is blocked");
    }
    if (wallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    wallet.balance -= amount;
    await wallet.save();
    return wallet;
  },
};

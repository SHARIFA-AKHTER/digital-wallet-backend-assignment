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

   async sendMoney(senderId: string, receiverId: string, amount: number) {
    if (senderId === receiverId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot send money to yourself");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const senderWallet = await Wallet.findOne({ user: new Types.ObjectId(senderId) }).session(session);
      const receiverWallet = await Wallet.findOne({ user: new Types.ObjectId(receiverId) }).session(session);

      if (!senderWallet) throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
      if (!receiverWallet) throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");

      if (senderWallet.isBlocked || receiverWallet.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, "One of the wallets is blocked");
      }

      if (senderWallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
      }

      senderWallet.balance -= amount;
      receiverWallet.balance += amount;

      await senderWallet.save({ session });
      await receiverWallet.save({ session });

      await session.commitTransaction();
      session.endSession();

      return { senderWallet, receiverWallet };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
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

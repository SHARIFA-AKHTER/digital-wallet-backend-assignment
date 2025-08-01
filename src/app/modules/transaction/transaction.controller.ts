/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from 'express';
// import { TransactionService } from './transaction.service';

// export const TransactionController = {
//   async getMyTransactions(req: Request, res: Response) {
//     try {
//       const userId = req.user.userId;
//       const transactions = await TransactionService.getTransactionsByUser(userId);
//       res.json(transactions);
//     } catch (err: any) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   async getAllTransactions(req: Request, res: Response) {
//     try {
//       const transactions = await TransactionService.getAllTransactions();
//       res.json(transactions);
//     } catch (err: any) {
//       res.status(500).json({ message: err.message });
//     }
//   },
// };

import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import httpStatus from 'http-status-codes';

export const TransactionController = {
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

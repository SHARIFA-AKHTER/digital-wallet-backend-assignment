import { Transaction } from './transaction.model';

export const TransactionService = {
  async createTransaction(data: {
    walletId: string;
    type: 'add' | 'withdraw' | 'send' | 'receive' | 'cashIn' | 'cashOut'; // ✅ add cashIn & cashOut here
    amount: number;
    fee?: number;
    commission?: number;
    status?: 'pending' | 'completed' | 'reversed';
    fromUser?: string;
    toUser?: string;
  }) {
    const transaction = new Transaction({
      wallet: data.walletId,
      type: data.type,
      amount: data.amount,
      fee: data.fee || 0,
      commission: data.commission || 0,
      status: data.status || 'pending',
      fromUser: data.fromUser,
      toUser: data.toUser,
    });

    await transaction.save();
    return transaction;
  },

  async getTransactionsByUser(userId: string) {
    return Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    }).sort({ createdAt: -1 });
  },

  async getAllTransactions() {
    return Transaction.find().sort({ createdAt: -1 });
  },
};


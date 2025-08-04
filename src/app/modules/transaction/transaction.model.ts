
import { Schema, model } from 'mongoose';
import { ITransaction } from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    type: {
      type: String,
      enum: ['add', 'withdraw', 'send', 'receive', 'cashIn', 'cashOut'], // ✅ Updated
      required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'completed', 'reversed'],
      default: 'pending',
    },
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    toUser: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);

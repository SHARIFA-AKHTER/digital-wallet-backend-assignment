import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  type: { type: String, enum: ['add', 'withdraw', 'send', 'receive'], required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'completed', 'reversed'], default: 'pending' },
  fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
  toUser: { type: Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export const Transaction = model('Transaction', transactionSchema);

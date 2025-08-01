import { Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  wallet: Types.ObjectId;
  type: 'add' | 'withdraw' | 'send' | 'receive';
  amount: number;
  fee: number;
  commission: number;
  status: 'pending' | 'completed' | 'reversed';
  fromUser?: Types.ObjectId;
  toUser?: Types.ObjectId;
  createdAt: Date;
}

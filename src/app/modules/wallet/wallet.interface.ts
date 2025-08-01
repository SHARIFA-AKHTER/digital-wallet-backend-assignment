/* eslint-disable @typescript-eslint/no-unused-vars */
import { Types } from 'mongoose';

export interface IWallet {
  user: Types.ObjectId;       
  balance: number;           
  isBlocked: boolean;         
  createdAt?: Date;          
  updatedAt?: Date;           
}

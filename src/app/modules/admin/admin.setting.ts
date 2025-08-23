import { Schema, model, type Document } from "mongoose";

export interface ISetting extends Document {
  transactionFee: number; 
  minLimit: number;
  maxLimit: number;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    transactionFee: { type: Number, default: 0 },
    minLimit: { type: Number, default: 10 },
    maxLimit: { type: Number, default: 50000 },
  },
  { timestamps: true }
);

export const Setting = model<ISetting>("Setting", SettingSchema);

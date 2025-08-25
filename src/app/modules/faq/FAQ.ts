import { Schema, model } from "mongoose";

const FAQSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { timestamps: true });

export const FAQ = model("FAQ", FAQSchema);

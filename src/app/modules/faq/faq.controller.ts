/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { FAQ } from "./FAQ";

export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

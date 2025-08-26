/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { FAQ } from "./FAQ";


// Get all FAQs
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add new FAQ
export const addFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.create({ question, answer });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

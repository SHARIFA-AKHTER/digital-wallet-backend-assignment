/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { About } from "./about.model";

// Get about info
export const getAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findOne();
    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const upsertAbout = async (req: Request, res: Response) => {
  try {
    const updated = await About.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json({
      success: true,
      message: "About info updated",
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

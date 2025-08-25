import { Schema, model } from "mongoose";

const AboutSchema = new Schema({
  title: { type: String, required: true },
  intro: { type: String, required: true },
  mission: { type: String, required: true },
  team: [
    {
      name: String,
      role: String,
    },
  ],
  features: [
    {
      icon: String,
      title: String,
      description: String,
    },
  ],
}, { timestamps: true });

export const About = model("About", AboutSchema);

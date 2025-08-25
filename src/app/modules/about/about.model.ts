
import { Schema, model } from "mongoose";

const AboutSchema = new Schema(
  {
    title: { type: String, required: true },
    intro: { type: String, required: true },
    mission: { type: String, required: true },
    team: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        photo: { type: String, required: true }, 
      },
    ],
    features: [
      {
        icon: { type: String },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const About = model("About", AboutSchema);

import { z } from "zod";

export const createUserZodSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});


export const updateUserSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});
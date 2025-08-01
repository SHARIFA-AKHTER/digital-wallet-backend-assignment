import { z } from "zod";

export const addMoneySchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive("Amount must be greater than zero"),
  }),
});

export const withdrawMoneySchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive("Amount must be greater than zero"),
  }),
});

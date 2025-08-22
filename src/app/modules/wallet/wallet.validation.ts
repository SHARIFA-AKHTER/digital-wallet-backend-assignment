

import { z } from "zod";

// ✅ Add Money Schema
export const addMoneySchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive("Amount must be greater than zero"),
  }),
});

// ✅ Withdraw Money Schema
export const withdrawMoneySchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive("Amount must be greater than zero"),
  }),
});

// ✅ Send Money Schema
export const sendMoneySchema = z.object({
  body: z.object({
    receiverId: z.string().nonempty("Receiver ID is required"),
    amount: z.coerce.number().positive("Amount must be greater than zero"),
  }),
});


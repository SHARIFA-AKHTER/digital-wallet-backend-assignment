import express, { Request, Response } from "express";

const router = express.Router();


const pricingPlans = [
  {
    name: "Basic",
    price: 0,
    features: [
      "Send & Receive Money",
      "View Transaction History",
      "Basic Support",
    ],
  },
  {
    name: "Premium",
    price: 10,
    features: [
      "All Basic Features",
      "Faster Transactions",
      "Priority Support",
      "Higher Transfer Limit",
    ],
  },
  {
    name: "Enterprise",
    price: 30,
    features: [
      "All Premium Features",
      "Custom Solutions",
      "Dedicated Account Manager",
      "Unlimited Transfers",
    ],
  },
];


router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: pricingPlans });
});

export const pricingRoutes = router;



import express from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

// ✅ All routes
router.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT),
  WalletController.getMyWallet
);
router.post(
  "/add",
  checkAuth(Role.USER, Role.AGENT),
  WalletController.addMoney
);
router.post(
  "/send-money",
  checkAuth(Role.USER, Role.AGENT),
  WalletController.sendMoney
);
router.post(
  "/withdraw",
  checkAuth(Role.USER, Role.AGENT),
  WalletController.withdrawMoney
);

export const walletRoutes = router;

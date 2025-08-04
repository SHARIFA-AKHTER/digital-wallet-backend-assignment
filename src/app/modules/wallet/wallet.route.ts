// import express from "express";
// import { WalletController } from "./wallet.controller";
// import { checkAuth } from "../../middlewares/checkAuth";
// import { Role } from "../user/user.interface";

// export const walletRoutes = express.Router();

// walletRoutes.get(
//   "/me",
//   // checkAuth(Role.USER, Role.AGENT),
//   WalletController.getMyWallet
// );
// walletRoutes.post(
//   "/add",
//   checkAuth(Role.USER, Role.AGENT),
//   WalletController.addMoney
// );
// walletRoutes.post(
//   "/withdraw",
//   // checkAuth(Role.USER, Role.AGENT),
//   WalletController.withdrawMoney
// );

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
  "/withdraw",
  checkAuth(Role.USER, Role.AGENT),
  WalletController.withdrawMoney
);

export const walletRoutes = router;

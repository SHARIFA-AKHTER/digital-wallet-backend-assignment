import { Router } from "express";
import { UserControllers } from "./user.controller";

import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// 👤 Accessible only by logged-in users

router.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT, Role.ADMIN),
  UserControllers.getLoggedInUser
);
router.patch(
  "/update-profile",
  checkAuth(Role.USER,Role.AGENT, Role.ADMIN),
  UserControllers.updateProfile
);
router.delete(
  "/delete-profile",
  checkAuth(Role.USER,Role.AGENT),
  UserControllers.deleteProfile
);

// 🔒 Admin-only
router.get("/",
  //  checkAuth(Role.ADMIN),
 UserControllers.getAllUsers);

export const UserRoutes = router;


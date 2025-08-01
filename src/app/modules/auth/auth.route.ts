
import { Router } from "express";
import passport from "passport";
import { AuthControllers,} from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {  loginSchema,  resetPasswordSchema } from "./auth.validation";

const router = Router();


router.post("/register", AuthControllers.register);


router.post(
  "/login",
  validateRequest(loginSchema),
  AuthControllers.credentialsLogin, 
  validateRequest(loginSchema),
  AuthControllers.credentialsLogin
);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/reset-password",
  checkAuth(Role.USER, Role.ADMIN),
  validateRequest(resetPasswordSchema),
  AuthControllers.resetPassword
);

// Google OAuth
router.get("/google", (req, res, next) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;

import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.post("/login", AuthControllers.loginUser);
router.post("/refresh-token", AuthControllers.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.admin, UserRole.super_admin, UserRole.patient, UserRole.doctor),
  AuthControllers.changePassword
);

export const AuthRoutes = router;

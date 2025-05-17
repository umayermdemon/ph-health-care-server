import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.post(
  "/create-admin",
  auth(UserRole.admin, UserRole.super_admin),
  userControllers.createAdmin
);

export const userRoutes = router;

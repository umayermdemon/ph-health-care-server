import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleWares/auth";

const router = Router();

router.post(
  "/create-admin",
  auth("admin", "super_admin"),
  userControllers.createAdmin
);

export const userRoutes = router;

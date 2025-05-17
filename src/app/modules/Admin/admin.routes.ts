import { Router } from "express";
import { adminControllers } from "./admin.controller";
import { adminValidationSchemas } from "./admin.validation";
import validateRequest from "../../middleWares/validateRequest";
import auth from "../../middleWares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.get(
  "/",
  auth(UserRole.super_admin, UserRole.admin),
  adminControllers.getAllAdmin
);
router.get(
  "/:id",
  auth(UserRole.super_admin, UserRole.admin),
  adminControllers.getByIdFromDb
);
router.patch(
  "/:id",
  auth(UserRole.super_admin, UserRole.admin),
  validateRequest(adminValidationSchemas.update),
  adminControllers.updateIntoDb
);
router.delete(
  "/:id",
  auth(UserRole.super_admin, UserRole.admin),
  adminControllers.deleteFromDb
);
router.patch(
  "/soft/:id",
  auth(UserRole.super_admin, UserRole.admin),
  adminControllers.softDeleteFromDb
);

export const adminRoutes = router;

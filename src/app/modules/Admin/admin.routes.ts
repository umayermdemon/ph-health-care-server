import { Router } from "express";
import { adminControllers } from "./admin.controller";
import { adminValidationSchemas } from "./admin.validation";
import validateRequest from "../../middleWares/validateRequest";

const router = Router();

router.get("/", adminControllers.getAllAdmin);
router.get("/:id", adminControllers.getByIdFromDb);
router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.update),
  adminControllers.updateIntoDb
);
router.delete("/:id", adminControllers.deleteFromDb);
router.patch("/soft/:id", adminControllers.softDeleteFromDb);

export const adminRoutes = router;

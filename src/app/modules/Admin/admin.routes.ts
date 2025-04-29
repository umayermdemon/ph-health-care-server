import { Router } from "express";
import { adminControllers } from "./admin.controller";

const router = Router();

router.get("/", adminControllers.getAllAdmin);
router.get("/:id", adminControllers.getByIdFromDb);
router.patch("/:id", adminControllers.updateIntoDb);
router.delete("/:id", adminControllers.deleteFromDb);

export const adminRoutes = router;

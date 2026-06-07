import { Router } from "express";
import { fieldController } from "../controllers/field.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", ensureAuthenticated as any, fieldController.create as any);
router.get("/", fieldController.findAll);
router.get("/:id", ensureAuthenticated as any, fieldController.findById);
router.put("/:id", ensureAuthenticated as any, fieldController.update as any);
router.delete("/:id", ensureAuthenticated as any, fieldController.delete as any);

export default router;
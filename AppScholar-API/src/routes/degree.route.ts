import { Router } from "express";
import { degreeController } from "../controllers/degree.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", ensureAuthenticated as any, degreeController.create as any);
router.get("/", degreeController.findAll);
router.get("/:id", ensureAuthenticated as any, degreeController.findById);
router.put("/:id", ensureAuthenticated as any, degreeController.update);
router.delete("/:id", ensureAuthenticated as any, degreeController.delete);

export default router;
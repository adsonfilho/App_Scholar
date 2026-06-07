import { Router } from "express";
import { gradeController } from "../controllers/grade.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", gradeController.create as any);
router.get("/", gradeController.findAll);
router.get("/:id", gradeController.findById);
router.put("/:id", gradeController.update as any);
//router.delete("/:id", gradeController.delete);

export default router;
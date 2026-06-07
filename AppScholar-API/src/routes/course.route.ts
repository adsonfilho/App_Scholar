import { Router } from "express";
import { courseController } from "../controllers/course.controller";

const router = Router();

router.post("/", courseController.create as any);
router.get("/", courseController.findAll);
router.get("/:id", courseController.findById);
router.put("/:id", courseController.update as any);
router.delete("/:id", courseController.delete as any);

export default router;
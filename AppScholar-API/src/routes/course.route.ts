import { Router } from "express";
import { courseController } from "../controllers/course.controller";

const router = Router();

router.post("/", courseController.create);
router.get("/", courseController.findAll);
router.get("/:id", courseController.findById);
router.put("/:id", courseController.update);
router.delete("/:id", courseController.delete);

export default router;
import { Router } from "express";
import { subjectController } from "../controllers/subject.controller";

const router = Router();

router.post("/", subjectController.create as any);
router.get("/", subjectController.findAll);
router.get("/:id", subjectController.findById);
router.put("/:id", subjectController.update);
router.get("/course/:courseId", subjectController.findAllByCourseId);
//router.delete("/:id", subjectController.delete);

export default router;
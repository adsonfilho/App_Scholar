import { Router } from "express";
import { degreeController } from "../controllers/degree.controller";

const router = Router();

router.post("/", degreeController.create);
router.get("/", degreeController.findAll);
router.get("/:id", degreeController.findById);
router.put("/:id", degreeController.update);
router.delete("/:id", degreeController.delete);

export default router;
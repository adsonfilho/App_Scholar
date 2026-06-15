import { Router } from "express";
import { alertController } from "../controllers/alert.controller";

const router = Router();

router.get("/", alertController.findAll as any);
router.post("/", alertController.create as any);

export default router;
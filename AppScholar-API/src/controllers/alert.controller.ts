import { Response, NextFunction } from "express";
import { alertService } from "../services/alert.service";
import { AuthRequest } from "../schemas/auth.schema";

class AlertController {
  public async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const loggedUserRole = req.user.role;
      const loggedUserId = req.user.id;

      if (loggedUserRole !== "ADMIN" && loggedUserRole !== "PROFESSOR") {
        return res.status(403).json({ 
          message: "Apenas administradores e professores podem publicar avisos." 
        });
      }

      const alert = await alertService.create(loggedUserId, req.body);
      return res.status(201).json(alert);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const alerts = await alertService.findAll();
      return res.status(200).json(alerts);
    } catch (error) {
      next(error);
    }
  }
}

export const alertController = new AlertController();
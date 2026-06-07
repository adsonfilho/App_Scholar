import { Request, Response, NextFunction } from "express";
import { fieldService } from "../services/field.service";
import { AuthRequest } from "../schemas/auth.schema";

class FieldController {
  public async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'ADMIN') {
        return res.status(403).json({ message: "Apenas administradores podem criar areas de atuacao." });
      }
      
      const field = await fieldService.create(req.body);
      return res.status(201).json(field);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const fields = await fieldService.findAll();
      return res.status(200).json(fields);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const field = await fieldService.findById(Number(req.params.id));
      return res.status(200).json(field);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const field = await fieldService.update(Number(req.params.id), req.body);
      return res.status(200).json(field);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await fieldService.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const fieldController = new FieldController();
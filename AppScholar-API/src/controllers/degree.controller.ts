import { Request, Response, NextFunction } from "express";
import { degreeService } from "../services/degree.service";
import { AuthRequest } from "../schemas/auth.schema";

class DegreeController {
  public async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'ADMIN') {
        return res.status(403).json({ message: "Apenas administradores podem criar niveis de formacao." });
      }

      const degree = await degreeService.create(req.body);
      return res.status(201).json(degree);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const degrees = await degreeService.findAll();
      return res.status(200).json(degrees);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const degree = await degreeService.findById(Number(req.params.id));
      return res.status(200).json(degree);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const degree = await degreeService.update(Number(req.params.id), req.body);
      return res.status(200).json(degree);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await degreeService.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const degreeController = new DegreeController();
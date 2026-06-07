import { Request, Response, NextFunction } from "express";
import { gradeService } from "../services/grade.service";
import { AuthRequest } from "../schemas/auth.schema";

class GradeController {
  public async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const professorUserId = req.user.id; 
      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'PROFESSOR') {
        return res.status(403).json({ message: "Apenas professores podem lançar notas." });
      }
      
      req.body.professorUserId = professorUserId;

      const grade = await gradeService.create(req.body);
      return res.status(201).json(grade);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const grades = await gradeService.findAll();
      return res.status(200).json(grades);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const grade = await gradeService.findById(Number(req.params.id));
      return res.status(200).json(grade);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {

      const professorUserId = req.user.id; 
      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'PROFESSOR') {
        return res.status(403).json({ message: "Apenas professores podem editar notas." });
      }

      req.body.professorUserId = professorUserId;

      const grade = await gradeService.update(Number(req.params.id), req.body);
      return res.status(200).json(grade);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await gradeService.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const gradeController = new GradeController();
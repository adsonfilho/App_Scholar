import { Request, Response, NextFunction } from "express";
import { subjectService } from "../services/subject.service";
import { AuthRequest } from "../schemas/auth.schema";

class SubjectController {
  public async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'ADMIN') {
        return res.status(403).json({ message: "Apenas administradores podem criar disciplinas." });
      }

      const subject = await subjectService.create(req.body);
      return res.status(201).json(subject);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await subjectService.findAll();
      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await subjectService.findById(Number(req.params.id));
      return res.status(200).json(subject);
    } catch (error) {
      next(error);
    }
  }

  public async findAllByCourseId(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await subjectService.findAllByCourseId(Number(req.params.courseId));
      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await subjectService.update(Number(req.params.id), req.body);
      return res.status(200).json(subject);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await subjectService.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const subjectController = new SubjectController();
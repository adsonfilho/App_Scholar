import { Request, Response, NextFunction } from "express";
import { courseService } from "../services/course.service";
import { AuthRequest } from "../schemas/auth.schema";

class CourseController {
  public async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {

      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'ADMIN') {
        return res.status(403).json({ message: "Apenas administradores podem criar cursos." });
      }

      const course = await courseService.create(req.body);
      return res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseService.findAll();
      return res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.findById(Number(req.params.id));
      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {

      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'ADMIN') {
        return res.status(403).json({ message: "Apenas administradores podem atualizar cursos." });
      }

      const course = await courseService.update(Number(req.params.id), req.body);
      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {

      const loggedUserRole = req.user.role;

      if (loggedUserRole !== 'ADMIN') {
        return res.status(403).json({ message: "Apenas administradores podem excluir cursos." });
      }

      await courseService.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const courseController = new CourseController();
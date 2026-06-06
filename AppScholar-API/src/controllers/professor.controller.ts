import { Request, Response, NextFunction } from 'express';
import { professorService } from '../services/professor.service';

class ProfessorController {
    
    public async createProfessor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const professor = await professorService.create(req.body);
            res.status(201).json(professor);
        } catch (error) {
            next(error);
        }
    }
    
    public async getProfessor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            const professor = await professorService.findByUserId(userId);
            res.status(200).json(professor);
        } catch (error) {
            next(error);
        }
    }
    
    public async getAllProfessors(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const professors = await professorService.findAll();
            res.status(200).json(professors);
        } catch (error) {
            next(error);
        }
    }

    public async updateProfessor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            const updatedProfessor = await professorService.updateByUserId(userId, req.body);
            res.status(200).json(updatedProfessor);
        } catch (error) {
            next(error);
        }
    }

    public async deleteProfessor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            await professorService.deleteByUserId(userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const professorController = new ProfessorController();
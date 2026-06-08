import { Request, Response, NextFunction } from 'express';
import { professorService } from '../services/professor.service';
import { AuthRequest } from '../schemas/auth.schema';

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

    public async getSubjectsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            const subjects = await professorService.findSubjectsByUserId(userId);
            res.status(200).json(subjects);
        } catch (error) {
            next(error);
        }
    }

    public async updateProfessor(req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response<any>> {
        try {

            const loggedUserRole = req.user.role;

            if (loggedUserRole !== 'PROFESSOR' && loggedUserRole !== 'ADMIN') {
                return res.status(403).json({ message: "Apenas professores e administradores podem editar informações." });
            }
            
            const userId = loggedUserRole === 'PROFESSOR' ? req.user.id : Number(req.params.userId);

            const updatedProfessor = await professorService.updateByUserId(userId, req.body);
            res.status(200).json(updatedProfessor);
        } catch (error) {
            next(error);
        }
    }

    public async deleteProfessor(req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response<any>> {
        try {

            const loggedUserRole = req.user.role;

            if (loggedUserRole !== 'ADMIN') {
                return res.status(403).json({ message: "Apenas administradores podem excluir professores." });
            }

            const userId = Number(req.params.userId);
            await professorService.deleteByUserId(userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const professorController = new ProfessorController();
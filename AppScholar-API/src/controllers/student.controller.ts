import { Request, Response, NextFunction } from 'express';
import { studentService } from '../services/student.service';

class StudentController {

    public async createStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const student = await studentService.create(req.body);
            res.status(201).json(student);
        } catch (error) {
            next(error);
        }
    }

    public async getStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);

            const student = await studentService.findByUserId(userId);
            res.status(200).json(student);
        } catch (error) {
            next(error);
        }
    }

    public async getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const students = await studentService.findAll();
            res.status(200).json(students);
        } catch (error) {
            next(error);
        }
    }
    
    public async updateStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            const updatedStudent = await studentService.updateByUserId(userId, req.body);
            res.status(200).json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    public async deleteStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            await studentService.deleteByUserId(userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const studentController = new StudentController();
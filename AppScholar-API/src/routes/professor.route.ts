import { Router } from 'express';
import { professorController } from '../controllers/professor.controller';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', ensureAuthenticated as any, professorController.getAllProfessors);
router.get('/:userId', ensureAuthenticated as any, professorController.getProfessor);
router.post('/', professorController.createProfessor);
router.put('/:userId', ensureAuthenticated as any, professorController.updateProfessor as any);
router.delete('/:userId', ensureAuthenticated as any, professorController.deleteProfessor as any);
router.get('/:userId/subjects', ensureAuthenticated as any, professorController.getSubjectsByUserId as any);

export default router;
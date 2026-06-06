import { Router } from 'express';
import { professorController } from '../controllers/professor.controller';
const router = Router();

router.get('/', professorController.getAllProfessors);
router.get('/:userId', professorController.getProfessor);
router.post('/', professorController.createProfessor);
router.put('/:userId', professorController.updateProfessor);
router.delete('/:userId', professorController.deleteProfessor);

export default router;
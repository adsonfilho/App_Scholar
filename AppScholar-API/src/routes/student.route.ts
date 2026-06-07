import { studentController } from '../controllers/student.controller';
import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', studentController.createStudent);
router.get('/', ensureAuthenticated as any, studentController.getAllStudents);
router.get('/:userId', ensureAuthenticated as any, studentController.getStudent);
router.put('/:userId', ensureAuthenticated as any, studentController.updateStudent as any);
router.delete('/:userId', ensureAuthenticated as any, studentController.deleteStudent as any);

export default router;
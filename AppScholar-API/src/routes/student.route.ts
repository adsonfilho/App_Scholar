import { studentController } from '../controllers/student.controller';
import { Router } from 'express';

const router = Router();

router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.get('/:userId', studentController.getStudent);
router.put('/:userId', studentController.updateStudent);
router.delete('/:userId', studentController.deleteStudent);

export default router;
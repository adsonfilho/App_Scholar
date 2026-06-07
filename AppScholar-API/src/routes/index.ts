import { Router } from 'express';
import userInvitationroutes from './user-invitation.route';
import studentRoutes from './student.route';
import professorRoutes from './professor.route';
import subjectRoutes from './subject.route';
import courseRoutes from './course.route';
import degreeRoutes from './degree.route';
import gradeRoutes from './grade.route';
import authRoutes from './auth.route';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.use("/auth", authRoutes);

router.use('/invitations', ensureAuthenticated as any, userInvitationroutes);
router.use('/students', studentRoutes);
router.use('/professors', professorRoutes);
router.use('/subjects', ensureAuthenticated as any, subjectRoutes);
router.use('/courses', ensureAuthenticated as any, courseRoutes);
router.use('/degrees', ensureAuthenticated as any, degreeRoutes);
router.use('/grades', ensureAuthenticated as any, gradeRoutes);

export default router;
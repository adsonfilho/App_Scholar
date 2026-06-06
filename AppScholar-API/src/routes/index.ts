import { Router } from 'express';
import userInvitationroutes from './user-invitation.route';
import studentRoutes from './student.route';
import professorRoutes from './professor.route';

const router = Router();

router.use('/invitations', userInvitationroutes);
router.use('/students', studentRoutes);
router.use('/professors', professorRoutes);

export default router;
import { userInvitationController } from '../controllers/user-invitation.controller';
import { Router } from 'express';

const router = Router();

router.post('/', userInvitationController.createInvitation as any);
router.get('/', userInvitationController.getAllInvitations);

export default router;
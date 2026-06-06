import { Request, Response, NextFunction } from 'express';
import { userInvitationService } from '../services/user-invitation.service';
import { createUserInvitationSchema } from '../schemas/user-invitation.schema';

class UserInvitationController {
    
    public async createInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = createUserInvitationSchema.parse(req.body);

            const invitation = await userInvitationService.create(data);
            
            res.status(201).json(invitation);
        } catch (error) {
            next(error);
        }
    }
    
    public async getAllInvitations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const invitations = await userInvitationService.findInvitations();
            res.json(invitations);
        } catch (error) {
            next(error);
        }
    }
}

export const userInvitationController = new UserInvitationController();

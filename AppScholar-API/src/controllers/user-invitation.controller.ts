import { Request, Response, NextFunction } from 'express';
import { userInvitationService } from '../services/user-invitation.service';
import { createUserInvitationSchema } from '../schemas/user-invitation.schema';
import { AuthRequest } from '../schemas/auth.schema';

class UserInvitationController {
    
    public async createInvitation(req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response<any>> {
        try {
 
            const loggedUserRole = req.user.role;

            if (loggedUserRole !== 'ADMIN') {
                return res.status(403).json({ message: "Apenas administradores podem criar convites." });
            }

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

import { UserInvitation } from "@prisma/client";
import { userInvitationRepository } from "../repositories/user-invitation.repositoty";
import { CreateUserInvitationDTO } from "../schemas/user-invitation.schema";

class UserInvitationService{
     
    public async create(data:CreateUserInvitationDTO):Promise<UserInvitation | null>{
        
        const existing = await userInvitationRepository.findExisting(data.email, data.enrollment);

        if(existing) throw new Error("E-mail ou matricula já cadastrados");
        
        const UserInvitation = await userInvitationRepository.create(data);

        return UserInvitation;
    }

}

export const userInvitationService = new UserInvitationService()
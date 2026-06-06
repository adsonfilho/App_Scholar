import { UserInvitation } from "@prisma/client";
import { userInvitationRepository } from "../repositories/user-invitation.repository";
import { CreateUserInvitationDTO } from "../schemas/user-invitation.schema";

class UserInvitationService{
     
    public async create(data:CreateUserInvitationDTO):Promise<UserInvitation>{
        
        const existing = await userInvitationRepository.findExisting(data.email, data.enrollment);

        if(existing){
            throw new Error("E-mail ou matricula já cadastrados");
        } 

        return userInvitationRepository.create(data);
    }

    public async findInvitations():Promise<UserInvitation[]>{
        return userInvitationRepository.findAll();
    }

    public async deleteInvitation(email: string):Promise<void>{
        await userInvitationRepository.deleteByEmail(email);
    }
}

export const userInvitationService = new UserInvitationService()
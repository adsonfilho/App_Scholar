import { UserInvitation } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { CreateUserInvitationDTO } from "../schemas/user-invitation.schema"

class UserInvitationRepository{

    public async create(data:CreateUserInvitationDTO){
        return prisma.userInvitation.create({ data })
    }

    public async findExisting(email: string, enrollment: string):Promise<UserInvitation | null>{
        return prisma.userInvitation.findFirst({
            where: {
                OR: [{email}, 
                    {enrollment}
                ]
            }
        });
    }

    public async findPending(): Promise<UserInvitation[]>{
        return prisma.userInvitation.findMany({
            where: { usedAt: null }
        });
    }

}

export const userInvitationRepository = new UserInvitationRepository()
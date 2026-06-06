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

    public async markAsUsed(id: number): Promise<UserInvitation> {        
        return prisma.userInvitation.update({
            where: { id },
            data: { usedAt: new Date() }
        });
    }

    public async findInvitation(email: string, enrollment: string): Promise<UserInvitation | null>{ 

        return prisma.userInvitation.findFirst({
            where: {
                enrollment,
                email
            }
        });
    }

    public async findAll(): Promise<UserInvitation[]>{
        return prisma.userInvitation.findMany();
    }

    public async deleteByEmail(email: string): Promise<void>{
        await prisma.userInvitation.delete({
            where: { email }
        });
    }
}

export const userInvitationRepository = new UserInvitationRepository()
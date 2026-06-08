import { hashPassword }  from "../lib/bcrypt";
import { professorRepository } from "../repositories/professor.repository";
import { userInvitationRepository } from "../repositories/user-invitation.repository";
import { CreateProfessorDTO, UpdateProfessorDTO } from "../schemas/professor.schema";



class ProfessorService {

    public async create(data:CreateProfessorDTO) {
        const existingInvitation = await userInvitationRepository.findInvitation(data.email, data.enrollment);

        if (!existingInvitation) {
            throw new Error('Nao existe um convite para este email ou matrícula.');
        }

        if (existingInvitation.usedAt) {
            throw new Error('Este convite já foi utilizado.');
        }

        data.password = await hashPassword(data.password);
        
        const professor = await professorRepository.create(data);
        
        await userInvitationRepository.markAsUsed(existingInvitation.id);
        
        return professor;
    }

    public async findByUserId(userId: number) {
        return professorRepository.findByUserId(userId);
    }

    public async findAll() {
        return professorRepository.findAll();
    }

    public async findSubjectsByUserId(userId: number) {
        return professorRepository.findSubjectsByUserId(userId);
    }

    public async updateByUserId(userId: number, data: UpdateProfessorDTO) {
        return professorRepository.updateByUserId(userId, data);
    }

    public async deleteByUserId(userId: number) {
        const professor = await professorRepository.findByUserId(userId);

        if (!professor) {
            throw new Error('Professor não encontrado.');
        }

        await userInvitationRepository.deleteByEmail(professor.email);
        
        return professorRepository.deleteByUserId(userId);
    }
}

export const professorService = new ProfessorService();
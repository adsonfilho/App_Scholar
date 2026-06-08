import { hashPassword }  from "../lib/bcrypt";
import { studentRepository } from "../repositories/student.repository";
import { userInvitationRepository } from "../repositories/user-invitation.repository";
import { CreateStudentDTO, createStudentSchema, UpdateStudentDTO, updateStudentSchema } from "../schemas/student.schema";

class StudentService{

    public async create(data: CreateStudentDTO){

        const existingInvitation = await userInvitationRepository.findInvitation(data.email, data.enrollment);

        if (!existingInvitation) {
            throw new Error('Nao existe um convite para este email ou matrícula.');
        }

        if (existingInvitation.usedAt) {
            throw new Error('Este convite já foi utilizado.');
        }

        if (existingInvitation.courseId === null) {
            throw new Error('Convite inválido: curso não informado.');
        }

        data.courseId = existingInvitation.courseId;
        data.password = await hashPassword(data.password);

        const student = createStudentSchema.parse(data);
        const createdStudent = await studentRepository.create(student);

        await userInvitationRepository.markAsUsed(existingInvitation.id);

        return createdStudent;
    }

    public async findByUserId(userId: number){
        return studentRepository.findByUserId(userId);
    }

    public async findAll(){
        return studentRepository.findAll();
    }

    public async updateByUserId(userId: number, data: UpdateStudentDTO){
        
        const student = updateStudentSchema.parse(data); 

        if (student.password != undefined && student.password.trim() !== '') {
            student.password = await hashPassword(student.password);
        }
        
        return studentRepository.updateByUserId(userId, student);
    }

    public async deleteByUserId(userId: number){
        const student = await studentRepository.findByUserId(userId);

        if (!student) {
            throw new Error('Estudante não encontrado.');
        }

        await userInvitationRepository.deleteByEmail(student.email);
        
        return studentRepository.deleteByUserId(userId);
    }
}


export const studentService = new StudentService();
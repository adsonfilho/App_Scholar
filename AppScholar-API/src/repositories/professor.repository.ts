import { prisma } from "../lib/prisma";
import { CreateProfessorDTO, UpdateProfessorDTO } from "../schemas/professor.schema";

class ProfessorRepository {


    public async create(data: CreateProfessorDTO) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'PROFESSOR',

                professor: {
                    create: {
                        degreeId: data.degreeId,
                        fieldId: data.fieldId,
                        teachingExperience: data.teachingExperience,
                    },
                },
            },
            include: {
                professor: true,
            },
        });
    }

    public async findByUserId(userId: number) {
        return prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
            include: {
                professor: true,
            },
        });
    }

    public async findAll() {
        return prisma.professor.findMany({
            include: {
                user: true,
            },
        });
    };

    public async updateByUserId(userId: number, data: UpdateProfessorDTO) {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: data.name,
                password: data.password,
                professor: {
                    update: {
                        degreeId: data.degreeId,
                        fieldId: data.fieldId,
                        teachingExperience: data.teachingExperience,
                    },
                },
            },
            include: {
                professor: true,
            },
        });
    }

    public async deleteByUserId(userId: number) {
        return prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
}

export const professorRepository = new ProfessorRepository();
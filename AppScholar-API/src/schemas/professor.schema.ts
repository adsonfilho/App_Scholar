import { z } from 'zod'
import { Role } from '@prisma/client'

export const createProfessorSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório'),
    enrollment: z
        .string()
        .min(1, 'Matrícula é obrigatória'),
    email: z
        .email('Email inválido')
        .nonempty('Email é obrigatório'),
    password: z
        .string()
        .min(6, 'A senha deve conter no mínimo 6 caracteres'),
    role: z
        .enum([Role.PROFESSOR], 'Cargo deve ser "PROFESSOR"'),
    degreeId: z
        .int()
        .min(1, 'ID do grau acadêmico é obrigatório'),
    fieldId: z
        .int()
        .min(1, 'ID da área de atuação é obrigatório'),
    teachingExperience: z
        .int()
        .min(0, 'Experiência de ensino deve ser um número positivo')
});

export const updateProfessorSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome inválido')
        .optional(),
    password: z
        .string()
        .min(6, 'A senha deve conter no mínimo 6 caracteres')
        .optional(),
    degreeId: z
        .int()
        .min(1, 'ID do grau acadêmico inválida')
        .optional(),
    fieldId: z
        .int()
        .min(1, 'ID da área de atuação inválida')
        .optional(),
    teachingExperience: z
        .int()
        .min(0, 'Experiência de ensino deve ser um número positivo')
        .optional(),
});
    

export type CreateProfessorDTO = z.infer<typeof createProfessorSchema>;
export type UpdateProfessorDTO = z.infer<typeof updateProfessorSchema>;
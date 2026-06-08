import { z } from 'zod'
import { Role } from '@prisma/client'

export const createStudentSchema = z.object({

    name: z
        .string()
        .min(1, 'Nome é obrigatório'),
    
    email: z
        .email('Email inválido')
        .nonempty('Email é obrigatório'),
    password: z
        .string()
        .min(6, 'A senha deve conter no mínimo 6 caracteres'),
    role: z
        .enum([Role.STUDENT], 'Cargo deve ser "STUDENT"'),

    enrollment: z
        .string()
        .min(1, 'Matricula é obrigatória'),
    phone: z
        .string()
        .min(1, 'Telefone é obrigatório')
        .regex(/^\d{10,11}$/, 'Formato de telefone inválido'),
    zipCode: z
        .string()
        .min(1, 'CEP é obrigatório')
        .regex(/^\d{5}-\d{3}$/, 'Formato de CEP inválido'),
    address: z
        .string()
        .min(1, 'Endereço é obrigatório'),
    neighborhood: z
        .string()
        .min(1, 'Bairro é obrigatório'),
    number: z
        .string()
        .min(1, 'Número é obrigatório'),
    city: z
        .string()
        .min(1, 'Cidade é obrigatória'),
    state: z
        .string()
        .min(1, 'Estado é obrigatório')
        .length(2, 'UF deve conter 2 caracteres'),
    courseId: z
        .int()
        .min(1, 'ID do curso é obrigatório')
});


export const updateStudentSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório')
        .optional(),
    password: z
        .string()
        .min(6, 'A senha deve conter no mínimo 6 caracteres')
        .optional(),
    phone: z
        .string()
        .min(1, 'Telefone é obrigatório')
        .regex(/^\d{10,11}$/, 'Formato de telefone inválido')
        .optional(),
    zipCode: z
        .string()
        .min(1, 'CEP é obrigatório')
        .regex(/^\d{5}-\d{3}$/, 'Formato de CEP inválido')
        .optional(),
    address: z
        .string()
        .min(1, 'Endereço é obrigatório')
        .optional(),
    number: z
        .string()
        .min(1, 'Número é obrigatório')
        .optional(),
    city: z
        .string()
        .min(1, 'Cidade é obrigatória')
        .optional(),
    state: z
        .string()
        .min(1, 'Estado é obrigatório')
        .length(2, 'UF deve conter 2 caracteres')
        .optional(),
    neighborhood: z
        .string()
        .min(1, 'Bairro é obrigatório')
        .optional(),
});

export type CreateStudentDTO = z.infer<typeof createStudentSchema>
export type UpdateStudentDTO = z.infer<typeof updateStudentSchema>
import { z } from 'zod';

export const professorSchema = z.object({
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
        .enum(['PROFESSOR'], 'Cargo deve ser "PROFESSOR"'),
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

export type IProfessor = z.infer<typeof professorSchema>;

export const TEACHER_INITIAL_STATE: IProfessor = {
  name: '', 
  enrollment: '', 
  email: '', 
  password: '', 
  role: 'PROFESSOR',
  degreeId: 0,
  fieldId: 0,
  teachingExperience: 0
};
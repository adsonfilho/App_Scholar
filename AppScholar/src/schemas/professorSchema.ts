import { z } from 'zod';

export const professorSchema = z.object({
    id: z
        .number()
        .optional(), 
    name: z
        .string()
        .min(1, 'Nome é obrigatório'),
    enrollment: z
        .string()
        .optional(),
    email: z
        .email('Email inválido')
        .nonempty('Email é obrigatório'),
    password: z
        .string()
        .optional(), 
    role: z
        .enum(['PROFESSOR'],'Cargo deve ser "PROFESSOR"'),
    degreeId: z
        .number()
        .int()
        .min(1, 'ID da titulação é obrigatório'),
    fieldId: z
        .number()
        .int()
        .min(1, 'ID da área de atuação é obrigatório'),
    teachingExperience: z
        .number()
        .int()
        .min(0, 'Experiência de ensino deve ser um número positivo')
}).superRefine((data, ctx) => {
    if (!data.id) {
        if (!data.enrollment || data.enrollment.trim() === '') {
            ctx.addIssue({
                code: "custom",
                message: 'Matrícula é obrigatória',
                path: ['enrollment'],
            });
        }
        if (!data.password || data.password.length < 6) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A senha deve conter no mínimo 6 caracteres',
                path: ['password'],
            });
        }
    } 
    else {
        if (data.password && data.password.trim().length > 0 && data.password.length < 6) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A nova senha deve conter no mínimo 6 caracteres',
                path: ['password'],
            });
        }
    }
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
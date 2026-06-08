import { z } from 'zod';

export const subjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "O nome da matéria deve ter pelo menos 3 caracteres"),
  workload: z.coerce
    .number()
    .min(1, "A carga horária deve ser maior que 0"),
  courseId: z.number("ID do curso inválido"),
  professorId: z.number("ID do professor inválido"),
  semester: z.int().min(1, 'O semestre deve ser informado')
});

export type ISubject = z.infer<typeof subjectSchema>;

export const SUBJECT_INITIAL_STATE = {
  name: '',
  workload: 0,
  courseId: 0,
  professorId: 0,
  semester: 0
};
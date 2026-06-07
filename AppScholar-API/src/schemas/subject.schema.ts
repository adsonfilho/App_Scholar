import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Nome da disciplina é obrigatório'),
  workload: z.int().min(1, 'Carga horária deve ser maior que zero'),
  semester: z.int().min(1, 'O semestre deve ser informado'),
  courseId: z.int().min(1, 'ID do curso é obrigatório'),
  professorId: z.int().min(1, 'ID do professor é obrigatório'),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1, 'Nome da disciplina é obrigatório').optional(),
  workload: z.int().min(1, 'Carga horária deve ser maior que zero').optional(),
  semester: z.int().min(1, 'O semestre deve ser informado').optional(),
  courseId: z.int().min(1, 'ID do curso é obrigatório').optional(),
  professorId: z.int().min(1, 'ID do professor é obrigatório').optional(),
});

export type CreateSubjectDTO = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectDTO = z.infer<typeof updateSubjectSchema>;
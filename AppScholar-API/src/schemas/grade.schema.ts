import { z } from 'zod';

export const createGradeSchema = z.object({
  grade1: z.number().min(0, 'Nota inválida').max(10, 'Nota inválida'),
  grade2: z.number().min(0, 'Nota inválida').max(10, 'Nota inválida').optional().nullable(),
  studentId: z.int().min(1, 'ID do aluno é obrigatório'),
  subjectId: z.int().min(1, 'ID da disciplina é obrigatório'),
});

export const updateGradeSchema = z.object({
  grade1: z.number().min(0, 'Nota inválida').max(10, 'Nota inválida').optional(),
  grade2: z.number().min(0, 'Nota inválida').max(10, 'Nota inválida').optional().nullable(),
});

export type CreateGradeDTO = z.infer<typeof createGradeSchema>;
export type UpdateGradeDTO = z.infer<typeof updateGradeSchema>;
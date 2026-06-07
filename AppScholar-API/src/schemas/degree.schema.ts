import { z } from 'zod';

export const createDegreeSchema = z.object({
  name: z.string().min(1, 'Nome da titulação é obrigatório'),
  active: z.boolean().optional(),
});

export const updateDegreeSchema = z.object({
  name: z.string().min(1, 'Nome da titulação é obrigatório').optional(),
  active: z.boolean().optional(),
});

export type CreateDegreeDTO = z.infer<typeof createDegreeSchema>;
export type UpdateDegreeDTO = z.infer<typeof updateDegreeSchema>;
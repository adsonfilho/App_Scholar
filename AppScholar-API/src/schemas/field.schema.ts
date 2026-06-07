import { z } from 'zod';

export const createFieldSchema = z.object({
  name: z.string().min(1, 'Nome da área de atuação é obrigatório'),
  active: z.boolean().optional(),
});

export const updateFieldSchema = z.object({
  name: z.string().min(1, 'Nome da área de atuação é obrigatório').optional(),
  active: z.boolean().optional(),
});

export type CreateFieldDTO = z.infer<typeof createFieldSchema>;
export type UpdateFieldDTO = z.infer<typeof updateFieldSchema>;
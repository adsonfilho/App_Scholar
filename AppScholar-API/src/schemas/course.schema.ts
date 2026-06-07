import { z } from 'zod';
import { CoursePeriod } from '@prisma/client';

export const createCourseSchema = z.object({
  name: z.string().min(1, 'Nome do curso é obrigatório'),
  acronym: z.string().min(1, 'Sigla do curso é obrigatória'),
  coursePeriod: z.enum([CoursePeriod.MORNING, CoursePeriod.AFTERNOON, CoursePeriod.EVENING, CoursePeriod.FULL_TIME], 'Período do curso inválido'),
  active: z.boolean().optional(),
});

export const updateCourseSchema = z.object({
  name: z.string().min(1, 'Nome do curso é obrigatório').optional(),
  acronym: z.string().min(1, 'Sigla do curso é obrigatória').optional(),
  coursePeriod: z.enum([CoursePeriod.MORNING, CoursePeriod.AFTERNOON, CoursePeriod.EVENING, CoursePeriod.FULL_TIME]).optional(),
  active: z.boolean().optional(),
});

export type CreateCourseDTO = z.infer<typeof createCourseSchema>;
export type UpdateCourseDTO = z.infer<typeof updateCourseSchema>;
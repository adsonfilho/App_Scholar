import { z } from 'zod';

export const CoursePeriodEnum = ['MORNING', 'AFTERNOON', 'EVENING', 'FULL_TIME'] as const;

export const courseSchema = z.object({
  id: z.int().optional(),
  name: z.string().min(2, "O nome do curso deve ter pelo menos 2 letras"),
  acronym: z.string().min(2, "A sigla deve ter pelo menos 2 letras (Ex: DSM, GE)"),
  coursePeriod: z.enum(CoursePeriodEnum, "Período do curso invalido."),
  active: z.boolean().default(true).optional(),
});

export type ICourse = z.infer<typeof courseSchema>;

export const COURSE_INITIAL_STATE: ICourse = {
  name: '',
  acronym: '',
  coursePeriod: 'MORNING', 
  active: true,
};
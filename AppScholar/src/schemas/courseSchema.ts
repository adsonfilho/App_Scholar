import { z } from 'zod';

export const courseSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "Nome da disciplina deve ter 3+ letras"),
  cargaHoraria: z.string().min(1, "Informe a carga horária"),
  professor: z.string().min(3, "Informe o professor responsável"),
  curso: z.string().min(2, "Informe o curso (Ex: DSM, GE)"),
  semestre: z.string().min(1, "Informe o semestre"),
});

export type ICourse = z.infer<typeof courseSchema>;

export const COURSE_INITIAL_STATE: ICourse = {
  nome: '',
  cargaHoraria: '',
  semestre: '',
  professor: '',
  curso: '',
};
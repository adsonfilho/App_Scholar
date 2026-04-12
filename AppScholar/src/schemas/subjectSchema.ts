import { z } from 'zod';

export const subjectSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "Nome da disciplina inválido"),
  cargaHoraria: z.string().min(1, "Informe a carga horária"),
  professorResponsavel: z.string().min(1, "Selecione um professor"),
  curso: z.string().min(1,  "Informe o curso"),
  semestre: z.string().min(1, "Informe o semestre"),
});

export type ISubject = z.infer<typeof subjectSchema>;

export const SUBJECT_INITIAL_STATE: ISubject = {
  nome: '', 
  cargaHoraria: '', 
  professorResponsavel: '', 
  curso: '', 
  semestre: ''
};
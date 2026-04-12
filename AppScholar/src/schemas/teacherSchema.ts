import { z } from 'zod';

export const teacherSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, {error: "Nome muito curto" }),
  titulacao: z.string().min(1, { error: "Informe a titulação" }),
  areaAtuacao: z.string().min(1, { error: "Informe a área de atuação" }),
  tempoDocencia: z.string().min(1, { error: "Informe o tempo de docência" }),
  email: z.email( { error: "E-mail inválido" }),
});

export type ITeacher = z.infer<typeof teacherSchema>;

export const TEACHER_INITIAL_STATE: ITeacher = {
  nome: '', 
  titulacao: '', 
  areaAtuacao: '', 
  tempoDocencia: '', 
  email: ''
};
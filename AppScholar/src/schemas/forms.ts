import { z } from 'zod';

export const studentSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  matricula: z.string().min(1, "Matrícula obrigatória"),
  curso: z.string().min(1, "Curso obrigatório"),
  email: z.email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  endereco: z.string().min(1, "Endereço obrigatório"),
  cidade: z.string().min(1, "Cidade obrigatória"),
  estado: z.string().length(2, "UF obrigatória (ex: SP)"),
});

export const teacherSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  titulacao: z.string().min(1, "Informe a titulação"),
  areaAtuacao: z.string().min(1, "Informe a área de atuação"),
  tempoDocencia: z.string().min(1, "Informe o tempo de docência"),
  email: z.email("E-mail inválido"),
});

export const subjectSchema = z.object({
  nome: z.string().min(3, "Nome da disciplina inválido"),
  cargaHoraria: z.string().min(1, "Informe a carga horária"),
  professorResponsavel: z.string().min(1, "Selecione um professor"),
  curso: z.string().min(1, "Informe o curso"),
  semestre: z.string().min(1, "Informe o semestre"),
});

export type IStudent = z.infer<typeof studentSchema>;
export type ITeacher = z.infer<typeof teacherSchema>;
export type ISubject = z.infer<typeof subjectSchema>;

export const STUDENT_INITIAL_STATE: IStudent = {
  nome: '', matricula: '', curso: '', email: '', telefone: '',
  cep: '', endereco: '', cidade: '', estado: ''
};

export const TEACHER_INITIAL_STATE: ITeacher = {
  nome: '', titulacao: '', areaAtuacao: '', tempoDocencia: '', email: ''
};

export const SUBJECT_INITIAL_STATE: ISubject = {
  nome: '', cargaHoraria: '', professorResponsavel: '', curso: '', semestre: ''
};
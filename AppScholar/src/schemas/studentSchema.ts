import { z } from 'zod';

export const studentSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "Digite um e-mail válido"),
  matricula: z.string().min(1, "Matrícula obrigatória"),
  curso: z.string().min(1, "Curso obrigatório"),
  email: z.email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  endereco: z.string().min(1, "Endereço obrigatório"),
  numero: z.string().min(1, "Numero obrigatório"),
  bairro: z.string().min(1, "Bairro obrigatório"),
  cidade: z.string().min(1, "Cidade obrigatória"),
  estado: z.string().length(2, "UF obrigatória (ex: SP)"),
});

export type IStudent = z.infer<typeof studentSchema>;

export const STUDENT_INITIAL_STATE: IStudent = {
  nome: '', 
  matricula: '', 
  curso: '', 
  email: '', 
  telefone: '',
  cep: '', 
  endereco: '', 
  numero: '',
  bairro: '',
  cidade: '', 
  estado: ''
};
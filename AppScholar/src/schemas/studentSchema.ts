import { z } from 'zod';

export const studentSchema = z.object({
    id: z
        .string()
        .optional(),
    name: z
        .string()
        .min(1, 'Nome é obrigatório'),
    email: z
        .email('Email inválido')
        .nonempty('Email é obrigatório'),
    password: z
        .string()
        .min(6, 'A senha deve conter no mínimo 6 caracteres'),
    role: z
        .enum(['STUDENT'], 'Cargo deve ser "STUDENT"'),
    enrollment: z
        .string()
        .min(1, 'Matricula é obrigatória'),
    phone: z
        .string()
        .min(1, 'Telefone é obrigatório')
        .regex(/^\d{10,11}$/, 'Formato de telefone inválido'),
    zipCode: z
        .string()
        .min(1, 'CEP é obrigatório')
        .regex(/^\d{5}-\d{3}$/, 'Formato de CEP inválido'),
    address: z
        .string()
        .min(1, 'Endereço é obrigatório'),
    neighborhood: z
        .string()
        .min(1, 'Bairro é obrigatório'),
    number: z
        .string()
        .min(1, 'Número é obrigatório'),
    city: z
        .string()
        .min(1, 'Cidade é obrigatória'),
    state: z
        .string()
        .min(1, 'Estado é obrigatório')
        .length(2, 'UF deve conter 2 caracteres')
});

export type IStudent = z.infer<typeof studentSchema>;

export const STUDENT_INITIAL_STATE: IStudent = {
  name: '',
  enrollment: '',
  email: '',
  phone: '',
  zipCode: '',
  address: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  password: '',
  role: 'STUDENT'
};
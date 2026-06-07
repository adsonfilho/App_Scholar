import { z } from 'zod';

export const invitationSchema = z.object({
  email: z.email('E-mail inválido').nonempty('O e-mail é obrigatório.'),
  role: z.enum(['STUDENT', 'PROFESSOR']),
  enrollment: z.string().min(1, 'A matrícula é obrigatória.'), 
  courseId: z.number().nullable().optional(),
}).refine((data) => {
  if (data.role === 'STUDENT' && !data.courseId) return false;
  return true;
}, {
  message: "Selecione um curso para o aluno",
  path: ["courseId"]
});
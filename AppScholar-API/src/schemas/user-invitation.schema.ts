import { z } from 'zod'
import { Role } from "@prisma/client"

export const createUserInvitationSchema = z.object({
  enrollment: z
    .string()
    .min(1, 'Matrícula é obrigatória'),

  email: z
    .email('E-mail inválido'),

  role: z.enum([Role.STUDENT, Role.PROFESSOR]),

  courseId: z
    .int()
    .min(1, 'ID do curso é obrigatório')
});

export type CreateUserInvitationDTO = z.infer<typeof createUserInvitationSchema>
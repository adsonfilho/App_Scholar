import { z } from 'zod'
import { Role } from "@prisma/client"

export const createUserInvitationSchema = z.object({
  enrollment: z
    .string()
    .min(1, 'Matrícula é obrigatória'),

  email: z
    .email('E-mail inválido'),

  role: z.enum([Role.STUDENT, Role.TEACHER]),
});

export type CreateUserInvitationDTO = z.infer<typeof createUserInvitationSchema>
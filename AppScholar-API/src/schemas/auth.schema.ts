import { z } from "zod";
import { Request } from "express";
import { Role } from "@prisma/client";

export interface AuthRequest extends Request {
  user: {
    id: number;
    role: Role;
  };
}

export const loginSchema = z.object({
  email: z
    .email("Email inválido")
    .nonempty("Email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória"),
});

export type LoginDTO = z.infer<typeof loginSchema>;
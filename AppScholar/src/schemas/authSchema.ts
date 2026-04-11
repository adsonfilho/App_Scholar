import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: "Digite um e-mail válido" }),
  
  password: z.string()
    .min(1, { error: "A senha é obrigatória" })
});
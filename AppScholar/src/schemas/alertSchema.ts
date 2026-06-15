import { z } from "zod";

export const createAlertSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres.").max(50),
  content: z.string().min(5, "O conteúdo deve ter no mínimo 5 caracteres."),
});
import { z } from "zod";

export const gradeInputSchema = z.object({
  grade1: z
    .number("A Nota 1 deve ser um número.")
    .min(0, "A Nota 1 não pode ser menor que 0.")
    .max(10, "A Nota 1 não pode ser maior que 10.")
    .nullable(),
  grade2: z
    .number("A Nota 2 deve ser um número.")
    .min(0, "A Nota 2 não pode ser menor que 0.")
    .max(10, "A Nota 2 não pode ser maior que 10.")
    .nullable(),
});
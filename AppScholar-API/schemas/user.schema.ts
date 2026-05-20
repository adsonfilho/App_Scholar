import z from "zod";
import Role from "@prisma/client";

export const CreateUserSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(6, "Password must have at least 6 characters"),

  role: z.enum(Role),
});

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    password: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
import { prisma } from "../lib/prisma";
import { comparePassword } from "../lib/bcrypt"; // Ajuste o nome conforme seu arquivo real
import { generateToken } from "../lib/jwt";
import { LoginDTO, loginSchema } from "../schemas/auth.schema";

class AuthService {
  public async login(data: LoginDTO) {
    const validatedData = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      throw new Error("E-mail ou senha incorretos.");
    }

    const passwordMatch = await comparePassword(validatedData.password, user.password);

    if (!passwordMatch) {
      throw new Error("E-mail ou senha incorretos.");
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}

export const authService = new AuthService();
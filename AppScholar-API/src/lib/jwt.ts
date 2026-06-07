import jwt from "jsonwebtoken";

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secreto_para_nao_dar_erro',
  expiresIn: "1d" as jwt.SignOptions["expiresIn"],
};

interface TokenPayload {
  userId: number;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
}
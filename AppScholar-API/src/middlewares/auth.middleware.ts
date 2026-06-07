import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../lib/jwt";
import { Role } from "@prisma/client";
import { AuthRequest } from "../schemas/auth.schema";

interface DecodedToken {
  userId: number;
  role: Role;
}

export function ensureAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Erro no formato do token." });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme ?? "")) {
    return res.status(401).json({ message: "Token malformatado." });
  }

  try {

    const decoded: DecodedToken = jwt.verify(token ?? "", jwtConfig.secret) as DecodedToken;

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
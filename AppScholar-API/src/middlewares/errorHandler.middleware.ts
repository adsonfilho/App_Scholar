import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { z, ZodError } from "zod" 

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    
    if (err instanceof ZodError) {
        res.status(400).json({ 
            message: "Erro de validação dos dados.", 
            errors: z.treeifyError(err)
        });
        return;
    }

    if (err instanceof Error && err.constructor === Error) {
        res.status(400).json({ message: err.message });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            res.status(404).json({ message: "Registro não encontrado no banco de dados." });
            return;
        }
    }

    res.status(500).json({ message: "Erro interno do servidor" });
}
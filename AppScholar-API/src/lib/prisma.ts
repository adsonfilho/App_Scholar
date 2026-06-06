import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient({
   accelerateUrl: process.env.DATABASE_URL,  
   log: ['query', 'info', 'warn', 'error'],
});
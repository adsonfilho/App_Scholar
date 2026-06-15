import { prisma } from "../lib/prisma";
import { CreateAlertDTO } from "../schemas/alert.schema";

class AlertRepository {
  public async create(userId: number, data: CreateAlertDTO) {
    return prisma.alert.create({
      data: {
        title: data.title,
        content: data.content,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });
  }

  public async findAll() {
    return prisma.alert.findMany({
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const alertRepository = new AlertRepository();
import { prisma } from "../lib/prisma";
import { CreateDegreeDTO, UpdateDegreeDTO } from "../schemas/degree.schema";

class DegreeRepository {
  public async create(data: CreateDegreeDTO) {
    return prisma.degree.create({
      data,
    });
  }

  public async findById(id: number) {
    return prisma.degree.findUniqueOrThrow({
      where: { id }
    });
  }

  public async findByName(name: string) {
    return prisma.degree.findUnique({
      where: { name },
    });
  }

  public async findAll() {
    return prisma.degree.findMany();
  }

  public async update(id: number, data: UpdateDegreeDTO) {
    return prisma.degree.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number) {
    return prisma.degree.delete({
      where: { id },
    });
  }
}

export const degreeRepository = new DegreeRepository();
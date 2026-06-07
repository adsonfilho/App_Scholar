import { prisma } from "../lib/prisma";
import { CreateFieldDTO, UpdateFieldDTO } from "../schemas/field.schema";

class FieldRepository {
  public async create(data: CreateFieldDTO) {
    return prisma.field.create({
      data,
    });
  }

  public async findById(id: number) {
    return prisma.field.findUniqueOrThrow({
      where: { id }
    });
  }

  public async findByName(name: string) {
    return prisma.field.findUnique({
      where: { name },
    });
  }

  public async findAll() {
    return prisma.field.findMany();
  }

  public async update(id: number, data: UpdateFieldDTO) {
    return prisma.field.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number) {
    return prisma.field.delete({
      where: { id },
    });
  }
}

export const fieldRepository = new FieldRepository();
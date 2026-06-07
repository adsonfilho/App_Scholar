import { prisma } from "../lib/prisma";
import { CreateCourseDTO, UpdateCourseDTO } from "../schemas/course.schema";

class CourseRepository {
  public async create(data: CreateCourseDTO) {
    return prisma.course.create({
      data,
    });
  }

  public async findById(id: number) {
    return prisma.course.findUniqueOrThrow({
      where: { id },
      include: {
        subjects: true,
        _count: {
          select: { students: true }
        }
      }
    });
  }

  public async findByName(name: string) {
    return prisma.course.findUnique({
      where: { name },
    });
  }

  public async findAll() {
    return prisma.course.findMany();
  }

  public async update(id: number, data: UpdateCourseDTO) {
    return prisma.course.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number) {
    return prisma.course.delete({
      where: { id },
    });
  }
}

export const courseRepository = new CourseRepository();
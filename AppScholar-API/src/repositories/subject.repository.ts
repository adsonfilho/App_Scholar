import { prisma } from "../lib/prisma";
import { CreateSubjectDTO, UpdateSubjectDTO } from "../schemas/subject.schema";

class SubjectRepository {
  public async create(data: CreateSubjectDTO) {
    return prisma.subject.create({
      data: {
        name: data.name,
        workload: data.workload,
        semester: data.semester,
        courseId: data.courseId,
        professorId: data.professorId,
      },
      include: {
        course: true,
        professor: { include: { user: true } },
      }
    });
  }

  public async findById(id: number) {
    return prisma.subject.findUniqueOrThrow({
      where: { id },
      include: {
        course: true,
        professor: { include: { user: true } },
        grades: true,
      }
    });
  }

  public async findAll() {
    return prisma.subject.findMany({
      include: {
        course: true,
        professor: { include: { user: true } },
      }
    });
  }

  public async findAllByCourseId(courseId: number) {
    return prisma.subject.findMany({
      where: { courseId },
      include: {
        professor: { include: { user: true } },
      }
    });
  }

  public async update(id: number, data: UpdateSubjectDTO) {
    return prisma.subject.update({
      where: { id },
      data,
      include: {
        course: true,
        professor: { include: { user: true } },
      }
    });
  }

  public async delete(id: number) {
    return prisma.subject.delete({
      where: { id },
    });
  }
}

export const subjectRepository = new SubjectRepository();
import { prisma } from "../lib/prisma";
import { CreateStudentDTO, UpdateStudentDTO } from "../schemas/student.schema";

class StudentRepository {
  public async create(data: CreateStudentDTO) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "STUDENT",

        student: {
          create: {
            enrollment: data.enrollment,
            phone: data.phone,
            zipCode: data.zipCode,
            address: data.address,
            city: data.city,
            state: data.state,
            number: data.number,
            courseId: data.courseId,
            neighborhood: data.neighborhood,
          },
        },
      },
      include: {
        student: true,
      },
    });
  }

  public async findByEnrollment(enrollment: string) {
    return prisma.student.findUniqueOrThrow({
      where: {
        enrollment,
      },
      include: {
        user: true,
      },
    });
  }

  public async findByUserId(userId: number) {
    return prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        student: true,
      },
    });
  }

  public async findByUserIdWithGrades(userId: number) {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        user: true,
        course: true,
        grades: {
          include: {
            subject: true,
          },
        },
      },
    });
  }

  public async findStudentsByCourseId(courseId: number) {
    return prisma.student.findMany({
      where: {
        courseId,
      },
      include: {
        user: true,
        course: true,
      },
    });
  }

  public async findAll() {
    return prisma.student.findMany({
      include: {
        user: true,
        course: true,
      },
    });
  }

  public async updateByUserId(userId: number, data: UpdateStudentDTO) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        password: data.password,
        student: {
          update: {
            phone: data.phone,
            zipCode: data.zipCode,
            address: data.address,
            city: data.city,
            state: data.state,
            number: data.number,
          },
        },
      },
      include: {
        student: true,
      },
    });
  }

  public async deleteByUserId(userId: number) {
    return prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}

export const studentRepository = new StudentRepository();

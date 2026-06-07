import { prisma } from "../lib/prisma";
import { CreateGradeDTO, UpdateGradeDTO } from "../schemas/grade.schema";
import { Situation } from "@prisma/client";

interface ICreateGradeInput extends CreateGradeDTO {
  average?: number | null;
  situation: Situation;
}

interface IUpdateGradeInput extends UpdateGradeDTO {
  average?: number | null;
  situation?: Situation;
}

class GradeRepository {
  public async create(data: ICreateGradeInput) {
    return prisma.grade.create({
      data: {
        grade1: data.grade1,
        grade2: data.grade2,
        average: data.average,
        situation: data.situation,
        studentId: data.studentId,
        subjectId: data.subjectId,
      },
      include: {
        student: { include: { user: true } },
        subject: true
      }
    });
  }

  public async findByUniqueCombination(studentId: number, subjectId: number) {
    return prisma.grade.findUnique({
      where: {
        studentId_subjectId: { studentId, subjectId }
      }
    });
  }

  public async findById(id: number) {
    return prisma.grade.findUniqueOrThrow({
      where: { id },
      include: {
        student: { include: { user: true } },
        subject: true
      }
    });
  }

  public async findAll() {
    return prisma.grade.findMany({
      include: {
        student: { include: { user: true } },
        subject: true
      }
    });
  }

  public async update(id: number, data: IUpdateGradeInput) {
    return prisma.grade.update({
      where: { id },
      data,
      include: {
        student: { include: { user: true } },
        subject: true
      }
    });
  }

  public async delete(id: number) {
    return prisma.grade.delete({
      where: { id },
    });
  }
}

export const gradeRepository = new GradeRepository();
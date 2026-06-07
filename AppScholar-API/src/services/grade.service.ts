import { gradeRepository } from "../repositories/grade.repository";
import { CreateGradeDTO, createGradeSchema, UpdateGradeDTO, updateGradeSchema } from "../schemas/grade.schema";
import { prisma } from "../lib/prisma";
import { Situation } from "@prisma/client";

class GradeService {
  private calculateAverageAndSituation(grade1: number, grade2: number | null | undefined) {
    if (grade2 === undefined || grade2 === null) {
      return { average: null, situation: Situation.PENDING };
    }

    const average = (grade1 + grade2) / 2;
    const situation = average >= 6.0 ? Situation.PASSED : Situation.FAILED;

    return { average, situation };
  }

  public async create(data: CreateGradeDTO) {
    const validatedData = createGradeSchema.parse(data);

    const studentExists = await prisma.student.findUnique({ where: { id: validatedData.studentId } });
    if (!studentExists) throw new Error('Estudante não encontrado.');

    const subjectExists = await prisma.subject.findUnique({ where: { id: validatedData.subjectId } });
    if (!subjectExists) throw new Error('Disciplina não encontrada.');

    const gradeExists = await gradeRepository.findByUniqueCombination(validatedData.studentId, validatedData.subjectId);
    if (gradeExists) {
      throw new Error('Já existe um registro de notas para este aluno nesta disciplina.');
    }

    const { average, situation } = this.calculateAverageAndSituation(validatedData.grade1, validatedData.grade2);

    return gradeRepository.create({
      ...validatedData,
      average,
      situation
    });
  }

  public async findById(id: number) {
    return gradeRepository.findById(id);
  }

  public async findAll() {
    return gradeRepository.findAll();
  }

  public async update(id: number, data: UpdateGradeDTO) {
    const validatedData = updateGradeSchema.parse(data);
    const existingGrade = await gradeRepository.findById(id);

    const updatedGrade1 = validatedData.grade1 !== undefined ? validatedData.grade1 : existingGrade.grade1;
    const updatedGrade2 = validatedData.grade2 !== undefined ? validatedData.grade2 : existingGrade.grade2;

    const { average, situation } = this.calculateAverageAndSituation(updatedGrade1, updatedGrade2);

    return gradeRepository.update(id, {
      grade1: validatedData.grade1,
      grade2: validatedData.grade2,
      average,
      situation
    });
  }

  public async delete(id: number) {
    const grade = await gradeRepository.findById(id);
    if (!grade) {
      throw new Error('Registro de nota não encontrado.');
    }

    return gradeRepository.delete(id);
  }
}

export const gradeService = new GradeService();
import { subjectRepository } from "../repositories/subject.repository";
import { courseRepository } from "../repositories/course.repository";
import { CreateSubjectDTO, createSubjectSchema, UpdateSubjectDTO, updateSubjectSchema } from "../schemas/subject.schema";
import { prisma } from "../lib/prisma";

class SubjectService {
  public async create(data: CreateSubjectDTO) {
    const validatedData = createSubjectSchema.parse(data);

    await courseRepository.findById(validatedData.courseId);

    const professorExists = await prisma.professor.findUnique({
      where: { id: validatedData.professorId }
    });
    if (!professorExists) {
      throw new Error('Professor informado não encontrado.');
    }

    return subjectRepository.create(validatedData);
  }

  public async findById(id: number) {
    return subjectRepository.findById(id);
  }

  public async findAll() {
    return subjectRepository.findAll();
  }

  public async findAllByCourseId(courseId: number) {
    return subjectRepository.findAllByCourseId(courseId);
  }

  public async update(id: number, data: UpdateSubjectDTO) {
    const validatedData = updateSubjectSchema.parse(data);

    if (validatedData.courseId) {
      await courseRepository.findById(validatedData.courseId);
    }

    if (validatedData.professorId) {
      const professorExists = await prisma.professor.findUnique({
        where: { id: validatedData.professorId }
      });
      if (!professorExists) {
        throw new Error('Professor informado não encontrado.');
      }
    }

    return subjectRepository.update(id, validatedData);
  }

  public async delete(id: number) {
    const subject = await subjectRepository.findById(id);
    if (!subject) {
      throw new Error('Disciplina não encontrada.');
    }

    return subjectRepository.delete(id);
  }
}

export const subjectService = new SubjectService();
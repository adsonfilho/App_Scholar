import { courseRepository } from "../repositories/course.repository";
import { CreateCourseDTO, createCourseSchema, UpdateCourseDTO, updateCourseSchema } from "../schemas/course.schema";

class CourseService {
  public async create(data: CreateCourseDTO) {
    const validatedData = createCourseSchema.parse(data);

    const courseExists = await courseRepository.findByName(validatedData.name);
    if (courseExists) {
      throw new Error('Já existe um curso cadastrado com este nome.');
    }

    return courseRepository.create(validatedData);
  }

  public async findById(id: number) {
    return courseRepository.findById(id);
  }

  public async findAll() {
    return courseRepository.findAll();
  }

  public async update(id: number, data: UpdateCourseDTO) {
    const validatedData = updateCourseSchema.parse(data);

    if (validatedData.name) {
      const courseExists = await courseRepository.findByName(validatedData.name);
      if (courseExists && courseExists.id !== id) {
        throw new Error('Já existe outro curso com este nome.');
      }
    }

    return courseRepository.update(id, validatedData);
  }

  public async delete(id: number) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Curso não encontrado.');
    }

    if (course._count && course._count.students > 0) {
      throw new Error('Não é possível excluir um curso que possui alunos vinculados.');
    }

    return courseRepository.delete(id);
  }
}

export const courseService = new CourseService();
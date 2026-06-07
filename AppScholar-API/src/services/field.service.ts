import { fieldRepository } from "../repositories/field.repository";
import { CreateFieldDTO, createFieldSchema, UpdateFieldDTO, updateFieldSchema } from "../schemas/field.schema";

class FieldService {
  public async create(data: CreateFieldDTO) {
    const validatedData = createFieldSchema.parse(data);

    const fieldExists = await fieldRepository.findByName(validatedData.name);
    if (fieldExists) {
      throw new Error('Esta área de atuação já está cadastrada.');
    }

    return fieldRepository.create(validatedData);
  }

  public async findById(id: number) {
    return fieldRepository.findById(id);
  }

  public async findAll() {
    return fieldRepository.findAll();
  }

  public async update(id: number, data: UpdateFieldDTO) {
    const validatedData = updateFieldSchema.parse(data);

    if (validatedData.name) {
      const fieldExists = await fieldRepository.findByName(validatedData.name);
      if (fieldExists && fieldExists.id !== id) {
        throw new Error('Já existe outra área de atuação com este nome.');
      }
    }

    return fieldRepository.update(id, validatedData);
  }

  public async delete(id: number) {
    const field = await fieldRepository.findById(id);
    if (!field) {
      throw new Error('Área de atuação não encontrada.');
    }

    return fieldRepository.delete(id);
  }
}

export const fieldService = new FieldService();
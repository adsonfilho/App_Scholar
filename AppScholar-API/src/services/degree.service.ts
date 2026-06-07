import { degreeRepository } from "../repositories/degree.repository";
import { CreateDegreeDTO, createDegreeSchema, UpdateDegreeDTO, updateDegreeSchema } from "../schemas/degree.schema";

class DegreeService {
  public async create(data: CreateDegreeDTO) {
    const validatedData = createDegreeSchema.parse(data);

    const degreeExists = await degreeRepository.findByName(validatedData.name);
    if (degreeExists) {
      throw new Error('Esta titulação já está cadastrada.');
    }

    return degreeRepository.create(validatedData);
  }

  public async findById(id: number) {
    return degreeRepository.findById(id);
  }

  public async findAll() {
    return degreeRepository.findAll();
  }

  public async update(id: number, data: UpdateDegreeDTO) {
    const validatedData = updateDegreeSchema.parse(data);

    if (validatedData.name) {
      const degreeExists = await degreeRepository.findByName(validatedData.name);
      if (degreeExists && degreeExists.id !== id) {
        throw new Error('Já existe outra titulação com este nome.');
      }
    }

    return degreeRepository.update(id, validatedData);
  }

  public async delete(id: number) {
    const degree = await degreeRepository.findById(id);
    if (!degree) {
      throw new Error('Titulação não encontrada.');
    }

    return degreeRepository.delete(id);
  }
}

export const degreeService = new DegreeService();
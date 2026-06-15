import { alertRepository } from "../repositories/alert.repository";
import { CreateAlertDTO, createAlertSchema } from "../schemas/alert.schema";

class AlertService {
  public async create(userId: number, data: CreateAlertDTO) {
    const validatedData = createAlertSchema.parse(data);
    return alertRepository.create(userId, validatedData);
  }

  public async findAll() {
    return alertRepository.findAll();
  }
}

export const alertService = new AlertService();
import { BaseEntity } from "src/models/entity/base/base.model";
import { IRepository } from "typing/repository/repository.interface";


export abstract class BaseService<T extends BaseEntity> {
  constructor(private readonly repository: IRepository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<T> {
    return this.repository.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}

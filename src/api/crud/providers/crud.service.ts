import { BaseEntity } from 'src/common/entities/base.model';
import { Repository } from 'typeorm';

export abstract class CrudService<T extends BaseEntity> {
  constructor(public readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findById(id: any): Promise<T> {
    return await this.repository.findOne(id);
  }

  async create(data: any): Promise<T[]> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: number, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

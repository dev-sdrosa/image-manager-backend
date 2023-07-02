import { BaseEntity } from 'src/models/entity/base/base.model';
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T> {
    const findOptions: FindOneOptions<T> = {
        where: {
            id: id,
        } as FindOptionsWhere<T>,
    };

    return this.repository.findOne(findOptions);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
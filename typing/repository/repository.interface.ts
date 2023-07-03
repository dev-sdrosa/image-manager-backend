import { BaseEntity } from "src/models/entity/base/base.model";


export interface IRepository<T extends BaseEntity> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
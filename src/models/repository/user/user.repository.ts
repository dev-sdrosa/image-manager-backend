import { Repository } from 'typeorm';
import { BaseRepository } from '../base/base.repository';
import { User } from 'src/models/entity/user/user.entity';
import { IRepository } from 'typing/repository/repository.interface';

export class UserRepository extends BaseRepository<User> implements IRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }
}
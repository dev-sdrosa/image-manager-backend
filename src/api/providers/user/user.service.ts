import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { User } from 'src/models/entity/user/user.entity';
import { UserRepository } from 'src/models/repository/user/user.repository';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(repository: UserRepository) {
    super(repository);
  }
}
import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { User } from 'src/models/entity/user/user.entity';
import { UserRepository } from 'src/models/repository/user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) repository: UserRepository) {
    super(repository);
  }
}
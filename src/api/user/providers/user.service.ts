import { Injectable } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/providers/base.service';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) repository: UserRepository) {
    super(repository);
  }
}
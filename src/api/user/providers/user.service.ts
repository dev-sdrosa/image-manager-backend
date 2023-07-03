import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/api/crud/providers/crud.service';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  public async checkEmailUniqueness(email: string): Promise<number> {
    return await this.repository.count({ where: {email: email} });
  }

  public async checkUsernameUniqueness(username: string): Promise<number> {
    return await this.repository.count({ where: {username: username} });
  }

  public async uncheckedUserByEmail(email: string): Promise<User> {
    return this.findByEmail(email.toLowerCase());
  }

  private throwUnauthorizedException(
    user: undefined | null | User,
  ): void {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findByUsername(username: string): Promise<User> {
    return await this.repository.findOne({
      where: {
        username: username
      }
    });
  }

  async findByEmail(email: string): Promise<User> {
    const findOptions: FindOneOptions<User> = {
      where: {
        email: email
      }
    };

    return this.repository.findOne(findOptions);
  }
}
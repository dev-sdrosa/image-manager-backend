import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CrudService } from 'src/api/crud/providers/crud.service';
import { CommonService } from 'src/common/providers/common.service';



@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    private readonly commonService: CommonService,

  ) {
    super(repository);
  }

  public async new(
    email: string,
    name: string,
    password: string,
  ): Promise<User> {
    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail);
    const user = this.repository.create({
      email: formattedEmail,
      name: name,
      username: name,
      password: await hash(password, 10),
    });
    
    return user.save();
  }

  public async findOneById(id: number): Promise<User> {
    const user = await this.repository.findOne({ where: {
      id: id
    }});

    
    return user;
  }

  public async findOneByUsername(
    username: string,
    forAuth = false,
  ): Promise<User> {
    const user = await this.repository.findOne({
      where: { username: username.toLowerCase() }
    });
    console.log(user)
    if (forAuth) {
      this.throwUnauthorizedException(user);
    } else {
      if (!user) {
        throw new NotFoundException('This user does not exists')
      }
    }

    return user;
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { email: email.toLowerCase() }
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  // necessary for password reset
  public async uncheckedUserByEmail(email: string): Promise<User> {
    return this.repository.findOne({
      where: { email: email.toLowerCase() }
    });
  }

  public async findOneByCredentials(
    id: number,
    version: number,
  ): Promise<User> {
    const user = await this.repository.findOne({ where: {
      id: id
    }});

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    return user;
  }

  public async updatePassword(
    userId: number,
    password: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.findOneById(userId);

    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    user.password = await hash(newPassword, 10);
    await this.update(userId, user)
    return user;
  }

  public async confirmEmail(
    userId: number,
    version: number,
  ): Promise<User> {
    const user = await this.findOneByCredentials(userId, version);

    if (user.confirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    user.confirmed = true;
    return await this.update(userId, user);
  }

  public async resetPassword(
    userId: number,
    version: number,
    password: string,
  ): Promise<User> {
    const user = await this.findOneByCredentials(userId, version);
    user.password = await hash(password, 10);
    await this.update(userId, user)
    return user;
  }

  private async checkUsernameUniqueness(username: string): Promise<void> {
    const count = await this.repository.count({ where: { username: username } });

    if (count > 0) {
      throw new ConflictException('Username already in use');
    }
  }

  private throwUnauthorizedException(
    user: undefined | null | User,
  ): void {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async checkEmailUniqueness(email: string): Promise<void> {
    const count = await this.repository.count({ where: { email: email } });

    if (count > 0) {
      throw new ConflictException('Email already in use');
    }
  }
  
}
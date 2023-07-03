import { Controller, Get, Post, Put, Delete, Param, Body, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { ChangeEmailDto, ChangePasswordDto, CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../providers/user.service';
import { CommonService } from 'src/common/providers/common.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commonService: CommonService
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    const user = await this.userService.findById(id);

    if (!user) {
      new NotFoundException('User not found')
    }
    
    return user
  }

  @Post()
  async create(@Body() data: CreateUserDto): Promise<User[]> {
    const emailCount = await this.userService.checkEmailUniqueness(data.email)

    if (emailCount > 0) {
      throw new ConflictException('Email already in use');
    }

    const formattedEmail = data.email.toLowerCase();
    const formattedName = this.commonService.formatName(data.name);

    return await this.userService.create({
      email: formattedEmail,
      name: formattedName,
      username: data.username,
      password: await hash(data.password, 10),
    });
  }

  @Put(':id')
  public async update(@Body() data: UpdateUserDto, @Param('id') id: number): Promise<User> {
    const user = await this.userService.findById(id);
    const { name, username } = data;

    if (!name) {
      if (name === user.name) {
        throw new BadRequestException('Name must be different');
      }

      user.name = this.commonService.formatName(name);
    }
    if (!username) {
      const formattedUsername = data.username.toLowerCase();

      if (user.username === formattedUsername) {
        throw new BadRequestException('Username should be different');
      }

      const count = await this.userService.checkUsernameUniqueness(formattedUsername);

      if (count > 0) {
        throw new ConflictException('Username already in use');
      }
      user.username = formattedUsername;
    }

    await this.userService.update(id, user)
    return user;
  }

  @Put('email/:id')
  public async updateEmail(
    id: number, 
    dto: ChangeEmailDto,
  ): Promise<User> {
    const user = await this.userService.findById(id);
    const { email, password } = dto;

    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const formattedEmail = email.toLowerCase();

    const count = await this.userService.checkEmailUniqueness(formattedEmail);

    if (count > 0) {
      throw new ConflictException('Username already in use');
    }

    user.email = formattedEmail;

    await this.userService.update(id, user)
    return user;
  }

  @Put('password/:id')
  public async updatePassword(
    @Param('id') id: number,
    @Body() data: ChangePasswordDto,
  ): Promise<User> {
    const user = await this.userService.findById(id);

    if (!(await compare(data.password, user.password))) {
      throw new BadRequestException('Wrong password');
    }
    if (await compare(data.newPassword, user.password)) {
      throw new BadRequestException('New password must be different');
    }

    user.password = await hash(data.newPassword, 10);
    await this.userService.update(id, user)
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
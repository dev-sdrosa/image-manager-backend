import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  @Post()
  async create(@Body() data: Partial<User>): Promise<User> {
    return this.userRepository.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<User>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}
import { Controller, Get, Post, Put, Delete, Param, Body, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { ChangeEmailDto, ChangePasswordDto, CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../providers/user.service';
import { CommonService } from 'src/common/providers/common.service';
import { CurrentUser } from 'src/api/auth/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commonService: CommonService
  ) {}
 
  @Delete(':id')
  async delete(@CurrentUser() id: number,): Promise<void> {
    return this.userService.delete(id);
  }
}
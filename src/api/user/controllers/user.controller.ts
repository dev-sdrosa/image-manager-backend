import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { UserService } from '../providers/user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    const user = await this.userService.findById(id);

    if (!user) {
      new NotFoundException('User not found')
    }
    
    return user
  }

}
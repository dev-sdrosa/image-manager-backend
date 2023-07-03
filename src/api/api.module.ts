import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as controllers from './controllers';
import * as providers from './providers';
import { UserRepository } from 'src/models/repository/user/user.repository';
import { User } from 'src/models/entity/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // Shared Modules Here
  ],
  exports: [UserRepository, providers.UserService],
  controllers: Object.values(controllers),
  providers: [UserRepository, ...Object.values(providers), ],
})
export class ApiModule {}

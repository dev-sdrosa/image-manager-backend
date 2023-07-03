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
  exports: [providers.UserService, UserRepository],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers), UserRepository],
})
export class ApiModule {}

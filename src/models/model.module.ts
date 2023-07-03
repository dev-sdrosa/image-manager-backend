import { Module } from '@nestjs/common';

import * as providers from './repository';
import { UserRepository } from 'src/models/repository/user/user.repository';

console.log(Object.values(providers))
@Module({

  exports: [UserRepository],
  providers: [UserRepository],
})
export class RepositoryModule {}

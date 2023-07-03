import { Module } from '@nestjs/common';
import * as providers from './';

console.log('r', Object.values(providers))
@Module({
  imports: [],
  exports: [...Object.values(providers)],
  providers: Object.values(providers),
})
export class RepositoryModule {}

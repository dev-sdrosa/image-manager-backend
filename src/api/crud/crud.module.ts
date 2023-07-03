import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CrudService } from './providers/crud.service';

@Module({
  imports: [UserModule],
  providers: [CrudService as any],
  exports: [CrudService],
})
export class CrudModule {}

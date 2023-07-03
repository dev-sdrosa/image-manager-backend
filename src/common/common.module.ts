import { Global, Module } from '@nestjs/common';
import { CommonService } from './providers/common.service';

@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonModule {}

import { Module } from '@nestjs/common';
import { ImageService } from './providers/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageController } from './controller/image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Image]),],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
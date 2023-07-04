import { Module } from '@nestjs/common';
import { ImageService } from './providers/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageController } from './controller/image.controller';
import { HttpModule } from '@nestjs/axios';
import { UnsplashService } from './providers/unsplash.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    HttpModule,
    CommonModule
  ],
  controllers: [ImageController],
  providers: [ImageService, UnsplashService],
  exports: [ImageService],
})
export class ImageModule {}
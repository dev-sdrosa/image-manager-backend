import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from "aws-sdk";
import { CrudService } from 'src/api/crud/providers/crud.service';
import { v4 as uuid } from 'uuid';
import { Image } from '../entities/image.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dto/page/page-options.dto';
import { PageDto } from 'src/common/dto/page/page.dto';
import { CreateUserDto } from 'src/api/user/dto/user.dto';
import { PageMetaDto } from 'src/common/dto/page/page-meta.dto';

@Injectable()
export class ImageService extends CrudService<Image> {
    AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });

    constructor(
        @InjectRepository(Image) repository: Repository<Image>
    ) {
        super(repository);
    }

    async uploadFile(file) {
        const { originalname } = file;
        return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
    }

    async s3_upload(file: Buffer, bucket: string, name: string, mimetype) {
        const params = {
            Bucket: bucket,
            Key: `${uuid()}-${name}`,
            Body: file,
            ACL: "public-read",
            ContentType: mimetype,
            ContentDisposition: "inline",
            CreateBucketConfiguration: {
                LocationConstraint: "ap-south-1"
            }
        };
        console.log(params);
        try {
            return await this.s3.upload(params).promise();
        }
        catch (e) {
            console.log(e);
        }
    }

    public async getImages(
        pageOptionsDto: PageOptionsDto
      ): Promise<PageDto<Image>> {
        const queryBuilder = this.repository.createQueryBuilder("user");
    
        queryBuilder
          .orderBy("user.createdAt", pageOptionsDto.order)
          .skip(pageOptionsDto.skip)
          .take(pageOptionsDto.take);
    
        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
    
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    
        return new PageDto(entities, pageMetaDto);
      }
}
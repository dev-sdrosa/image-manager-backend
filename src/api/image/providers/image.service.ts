import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from "aws-sdk";
import { CrudService } from 'src/api/crud/providers/crud.service';
import { v4 as uuid } from 'uuid';
import { Image } from '../entities/image.entity';
import { Repository } from 'typeorm';
import { PageImagesDto, PageOptionsDto } from 'src/common/dto/page/page-options.dto';
import { PageDto } from 'src/common/dto/page/page.dto';
import { PageMetaDto } from 'src/common/dto/page/page-meta.dto';
import { HttpService } from '@nestjs/axios/dist';

@Injectable()
export class ImageService extends CrudService<Image> {
    AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });

    constructor(
        @InjectRepository(Image) repository: Repository<Image>,
        private readonly httpService: HttpService
    ) {
        super(repository);
    }

    public async uploadFile(file) {
        const { originalname } = file;
        return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
    }

    public async uploadFileUnsplash(fileBuffer: Buffer, filename: string, mime: string) {
        return await this.s3_upload(fileBuffer, this.AWS_S3_BUCKET, filename, mime);
    }

    public async s3_upload(file: Buffer, bucket: string, name: string, mimetype) {
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

        try {
            return await this.s3.upload(params).promise();
        }
        catch (e) {
            console.log(e);
        }
    }

    public async s3_update(key: string, name: string) {
        const newKey = `${uuid()}-${name}`;

        await this.s3.copyObject({
            Bucket: process.env.AWS_S3_BUCKET,
            CopySource: `${this.AWS_S3_BUCKET}/${key}`,
            Key: newKey
        }).promise()

        await this.s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        }).promise()

        return newKey
    }

    public async s3_delete(key: string) {
        return this.s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        }).promise()
    }

    public async getDBImages(
        pageOptionsDto: PageImagesDto
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

    public async generatePresignedUrl(key: string) {
     
        return await this.s3.getSignedUrlPromise('getObject', {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key
        })
      }

}
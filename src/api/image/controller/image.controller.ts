import { Controller, HttpStatus, Post, Put, Res, Param, Get, Body, HttpCode, Query, UploadedFile, UseInterceptors, NotFoundException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { ImageService } from "../providers/image.service";
import { IMessage } from "src/common/interfaces/message.interface";
import { ImageResponseMapper } from "../mappers/image.mapper";
import {
    ApiOkResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiParam,
    ApiQuery
} from '@nestjs/swagger';
import { PageImagesDto, PageUnsplashDto } from "src/common/dto/page/page-options.dto";
import { PageDto } from "src/common/dto/page/page.dto";
import { Image } from "../entities/image.entity";
import { ImageDto } from "../dto/image.dto";
import { UnsplashService } from "../providers/unsplash.service";
import { CommonService } from "src/common/providers/common.service";

const mime = require('mime');


@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
        private readonly unsplashService: UnsplashService,
        private readonly commonService: CommonService
    ) { }

    @Post()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'File uploaded successfully',
    })
    @ApiBody({
        type: "multipart/form-data",
        schema: {
            type: "object",
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiBearerAuth()
    async uploadFile(
        @UploadedFile('file') file: Express.Multer.File
    ): Promise<IMessage> {
        const uploadedFile = await this.imageService.uploadFile(file);
        const image = await this.imageService.create({
            fileName: uploadedFile.Key,
            fileUrl: uploadedFile.Location,
            key: uploadedFile.Key
        })
        // @ts-ignore
        return ImageResponseMapper.map(image)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getImages(
        @Query() pageOptionsDto: PageImagesDto
    ): Promise<PageDto<Image>> {
        return this.imageService.getDBImages(pageOptionsDto);
    }

    @Get('unsplash')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getUnsplashImages(
        @Query() pageOptionsDto: PageUnsplashDto
    ): Promise<PageDto<Image>> {
        return await this.unsplashService.getImages(pageOptionsDto);
    }

    @Post('unsplash/save/:url')
    @HttpCode(HttpStatus.OK)
    @ApiParam({name: 'url', required: true, description: 'Url from /api/image/unsplash, only urls.regular, urls.full, urls.small and urls.thumbnail works.'})
    @ApiBearerAuth()
    async downloadUnsplashImage(
        @Param() param: {url: string}
    ): Promise<Image> {
        const file = await this.unsplashService.downloadExternalImage(param.url);
        const uploadedFile = await this.imageService.uploadFileUnsplash(file.buffer, file.filename, mime.getType(file.filename));
        const image = await this.imageService.create({
            fileName: uploadedFile.Key,
            fileUrl: uploadedFile.Location,
            key: uploadedFile.Key
        })
        // @ts-ignore
        return ImageResponseMapper.map(image)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getImage(
        @Param('id') id: number
    ) {
        const file = await this.imageService.findById(id);
        if (!file) {
            throw new NotFoundException('File does not exists')
        }
        const url = await this.imageService.generatePresignedUrl(file.key);
        return { image: file, url: url }
    }

    // @Put('s3')
    // @ApiQuery({ name: 'id' })
    // @ApiBearerAuth()
    // async updateS3File(
    //     @Res() res: Response,
    //     @Query() query: any,
    //     @Body() fileDto: ImageDto,
    // ) {
    //     // CHECK S3 PUT PERMISSIONS ON "process.env.AWS_S3_BUCKET"
    //     const file = await this.imageService.findById(query.id);
    //     if (!file) {
    //         throw new NotFoundException('File does not exists')
    //     }
    //     const newKey = await this.imageService.s3_update(file.key, file.fileName);

    //     file.fileName = newKey;
    //     await file.save()

    //     return file
    // }

    // @Put()
    // @ApiQuery({ name: 'id' })
    // @ApiBearerAuth()
    // async updateFile(
    //     @Query() query: any,
    //     @Body() fileDto: ImageDto,
    // ) {
    //     // Partial edition of filename
    //     const file = await this.imageService.findById(query.id);
    //     if (!file) {
    //         throw new NotFoundException('File does not exists')
    //     }
    //     file.fileName = fileDto.filename;
    //     await file.save()

    //     return file
    // }
}
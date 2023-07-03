import { Controller, HttpStatus, Post, Get, HttpCode, Query,UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { ImageService } from "../providers/image.service";
import { IMessage } from "src/common/interfaces/message.interface";
import { ImageResponseMapper } from "../mappers/image.mapper";
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes
} from '@nestjs/swagger';
import { PageOptionsDto } from "src/common/dto/page/page-options.dto";
import { PageDto } from "src/common/dto/page/page.dto";
import { Image } from "../entities/image.entity";



@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService) { }

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
        console.log('uploadedFile', uploadedFile);
        const image = await this.imageService.create({
            fileName: uploadedFile.Key,
            fileUrl: uploadedFile.Location,
            key: uploadedFile.Key
        })
        console.log('image', image);
        // @ts-ignore
        return ImageResponseMapper.map(image)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getUsers(
        @Query() pageOptionsDto: PageOptionsDto
    ): Promise<PageDto<Image>> {
        return this.imageService.getImages(pageOptionsDto);
    }

}
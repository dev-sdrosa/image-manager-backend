import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StorageObjectDto {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File
}

export abstract class ImageDto {

    @ApiProperty({
        description: 'Filename used to name a file',
        minLength: 5,
        maxLength: 255,
        type: String,
    })
    @IsString()
    public filename: string;
}
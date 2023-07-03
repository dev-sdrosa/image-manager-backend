import { IUser } from 'src/api/user/interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IImage } from '../interfaces/image.interface';

export class ImageResponseMapper {
    fileName: string
    fileUrl: string
    key: string

    constructor(values: IImage) {
        Object.assign(this, values);
    }

    public static map(image: IImage): ImageResponseMapper {
        return new ImageResponseMapper({
            id: image.id,
            fileName: image.fileName,
            fileUrl: image.fileUrl,
            key: image.key,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt,
        });
    }
}
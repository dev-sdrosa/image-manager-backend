import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.model';


@Entity()
export class Image extends BaseEntity {
    @Column("varchar")
    fileName: string;

    @Column("varchar")
    fileUrl: string;  

    @Column("varchar")
    key: string;     
}
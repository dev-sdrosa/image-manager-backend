import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.model';



@Entity()
export class User extends BaseEntity {
    @Column("varchar", { length: 100 })
    public name: string;
  
    @Column("varchar", { length: 106, unique: true })
    public username: string;
 
    @Column("varchar", { length: 255 })
    public email: string;
 
    @Column("bool", { default: false})
    public confirmed: boolean;
  
    @Column("varchar", { length: 60 })
    public password: string;
}
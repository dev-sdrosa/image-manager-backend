import { ApiProperty } from '@nestjs/swagger';
import { IUser } from "src/api/user/interfaces/user.interface";



export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
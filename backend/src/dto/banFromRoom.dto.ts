/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { RoomType } from 'src/utils/userData.interface';



export class BanFromRoom {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    @IsNotEmpty()
    @IsString()
    bannedUserId:string;

    @IsNotEmpty()
    @IsNumber()
    duration:number;    
}
 
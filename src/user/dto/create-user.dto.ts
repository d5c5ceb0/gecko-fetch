import {ApiProperty} from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'User Name' })
    @IsString()
    @Length(3, 100)
    username: string;
    
    @ApiProperty({ example: 'Password' })
    @IsString()
    @Length(10, 5000)
    password: string;
}

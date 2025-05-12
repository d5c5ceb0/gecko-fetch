import {ApiProperty} from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateAddressDto {
    @ApiProperty({ example: '0x7160014e989cf39c9a5c07217e9b87bc36034339' })
    @IsString()
    @Length(42)
    address: string;
    
    @ApiProperty({ example: '7532043229' })
    @IsString()
    owner: string;

    @ApiProperty({ example: 'xxx_bot' })
    @IsString()
    botname: string;
}

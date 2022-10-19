import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

/* eslint indent: "off" */
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "DTO User's name", nullable: true })
    name: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(7, 20)
    @ApiProperty({ description: "DTO User's phone", nullable: true })
    phone: string;
}

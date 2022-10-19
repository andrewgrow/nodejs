import { ApiProperty } from '@nestjs/swagger';

/* eslint indent: "off" */
export class CreateUserDto {
    @ApiProperty({ description: "DTO User's name", nullable: true })
    name: string;

    @ApiProperty({ description: "DTO User's phone", nullable: true })
    phone: string;
}

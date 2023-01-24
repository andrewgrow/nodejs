import {
    IsMobilePhone,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import { User } from '../users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserTelegramUpdateDto } from './users.telegram.update.dto';
import { Type } from 'class-transformer';
import { UserTelegram } from '../users.telegram.schema';

export class UpdateUserDto implements Partial<User> {
    @ApiProperty({
        description: 'The name of a user. Not will update when empty.',
        minimum: 2,
        maximum: 200,
        type: String,
        required: false,
        nullable: true,
        example: 'John',
    })
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Length(2, 20)
    name?: string;

    @ApiProperty({
        description: 'The phone of a user. Not will update when empty.',
        minimum: 8,
        maximum: 21,
        type: String,
        required: false,
        nullable: true,
        example: '+594 700 XXX XXX XXX',
    })
    @IsNotEmpty()
    @IsOptional()
    @Length(8, 21)
    @IsMobilePhone()
    phone: string;

    @ApiProperty({
        description: 'The password of a user. Not will update when empty.',
        minimum: 8,
        maximum: 1024,
        type: String,
        required: false,
        nullable: true,
        example: 'Qwerty78',
    })
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Length(8, 1024)
    password: string;

    @ApiProperty({
        description: 'The telegram of a user. Not will update when empty.',
        type: UserTelegramUpdateDto,
        required: false,
        nullable: true,
        example: UserTelegramUpdateDto,
    })
    @IsNotEmpty()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => UserTelegramUpdateDto)
    telegram: UserTelegram;
}

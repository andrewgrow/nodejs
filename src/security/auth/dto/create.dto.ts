import {
    IsMobilePhone,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import { User } from '../../../users/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserTelegramCreateDto } from '../../../users/dto/telegram.create.dto';
import { UserTelegram } from '../../../users/users.telegram.schema';

export class CreateUserDto implements Partial<User> {
    @ApiProperty({
        description: 'The name of a user. Not required.',
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
        description: 'The phone of a user. Required.',
        minimum: 8,
        maximum: 21,
        type: String,
        required: true,
        nullable: false,
        example: '+594 700 XXX XXX XXX (without spaces)',
    })
    @Length(8, 21)
    @IsMobilePhone()
    phone: string;

    @ApiProperty({
        description: 'The password of a user. Required.',
        minimum: 8,
        maximum: 1024,
        type: String,
        required: false,
        nullable: true,
        example: 'Qwerty78',
    })
    @IsString()
    @Length(8, 1024)
    password: string;

    @ApiProperty({
        description: 'The telegram of a user. Not required.',
        type: UserTelegramCreateDto,
        required: false,
        nullable: true,
        example: UserTelegramCreateDto,
    })
    @IsNotEmpty()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => UserTelegramCreateDto)
    telegram: UserTelegram;
}

import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserTelegram } from '../interfaces/users.telegram';

export class UserTelegramCreateDto implements Partial<IUserTelegram> {
    @ApiProperty({
        description: 'The chat id of a user. Required.',
        type: Number,
        required: true,
        nullable: false,
        example: '1234567890',
    })
    @IsNumber({ allowNaN: false })
    chatId: number;

    @ApiProperty({
        description: 'The public name of a user. Optional.',
        minimum: 2,
        maximum: 100,
        type: String,
        required: false,
        nullable: true,
        example: 'John',
    })
    @IsNotEmpty()
    @IsOptional()
    @Length(2, 100)
    @IsString()
    publicName?: string;

    @ApiProperty({
        description: 'Username in Telegram used as @john1980. Optional.',
        minimum: 2,
        maximum: 100,
        type: String,
        required: false,
        nullable: true,
        example: 'john1980',
    })
    @IsNotEmpty()
    @IsOptional()
    @Length(2, 100)
    @IsString()
    userName?: string;
}

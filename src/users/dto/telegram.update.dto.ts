import {
  IsEmail, IsMobilePhone,
  IsNotEmpty, IsNumber, IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IUserTelegram } from '../interfaces/users.telegram';

export class UserTelegramUpdateDto implements Partial<IUserTelegram> {
  @ApiProperty({
    description: 'The chat id of a user. Not will update when empty.',
    type: Number,
    required: false,
    nullable: true,
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber({ allowNaN: false })
  chatId?: number;

  @ApiProperty({
    description: 'The public name of a user. Not will update when empty.',
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
    description: 'Username in Telegram used as @john1980. Not will update when empty.',
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
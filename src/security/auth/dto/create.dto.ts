import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../../../users/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateUserDto implements Partial<User> {
  @ApiProperty({
    description: 'The email of a user. Cannot be empty for creating.',
    minimum: 5,
    maximum: 100,
    type: String,
    required: true,
    nullable: false,
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @Length(5, 100)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The first name of a user. Can be empty.',
    minimum: 2,
    maximum: 200,
    type: String,
    required: false,
    nullable: true,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  firstName?: string;

  @ApiProperty({
    description: 'The last name of a user. Can be empty.',
    minimum: 2,
    maximum: 200,
    type: String,
    required: false,
    nullable: true,
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  lastName?: string;

  @ApiProperty({
    description: 'The password of a user. Cannot be empty for creating.',
    minimum: 8,
    maximum: 1024,
    type: String,
    required: true,
    nullable: false,
    example: 'Qwerty78',
  })
  @IsString()
  @Length(8, 1024)
  password: string;
}

export const CreateUserValidationSchema = Joi.object({
  email: Joi.string().email().min(5).max(100).lowercase().required(),
  password: Joi.string().min(8).max(1024).required(),
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
});

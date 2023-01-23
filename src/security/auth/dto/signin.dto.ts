import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../users/users.schema';

export class SignInDto implements Partial<User> {
  @ApiProperty({
    description: 'The phone of a user. Required.',
    minimum: 8,
    maximum: 21,
    type: String,
    required: true,
    nullable: false,
    example: '+594 700 XXX XXX XXX',
  })
  @Length(8, 21)
  @IsMobilePhone()
  phone: string;

  @ApiProperty({
    description: 'The password of a user. Required.',
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.dto';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AppJwtGuard } from '../security/jwt/app.jwt.guard';
import { UserId } from '../security/jwt/app.jwt.decoder';

@ApiTags('Users')
@Controller('/users')
@UseGuards(AppJwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully found.',
  })
  async get(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully found.',
  })
  @ApiResponse({
    status: 404,
    description: `User with id not found.`,
  })
  getUserById(@Param('id') findId: string, @UserId() commandUserId: string) {
    return this.usersService.getUserById(findId);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully patched.',
  })
  @ApiResponse({
    status: 404,
    description: `User with id not found.`,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check model arguments.',
  })
  update(
    @Param('id') updateId: string,
    @UserId() commandUserId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateId, updateUserDto);
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: `User account not found for deleting.`,
  })
  delete(@Param('id') deleteId: string, @UserId() commandUserId: string) {
    return this.usersService.deleteUser(deleteId);
  }
}

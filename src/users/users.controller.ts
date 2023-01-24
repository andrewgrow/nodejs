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
        type: [User],
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
        if (JSON.stringify(commandUserId) !== JSON.stringify(findId)) {
            console.log(`User ${commandUserId} find next user: ${findId}`);
        }
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
        @Body(
            new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
        )
        updateUserDto: UpdateUserDto,
    ) {
        if (JSON.stringify(commandUserId) !== JSON.stringify(updateId)) {
            console.log(`User ${commandUserId} update next user: ${updateId}`);
        }
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
        if (JSON.stringify(commandUserId) !== JSON.stringify(deleteId)) {
            console.log(`User ${commandUserId} delete next user: ${deleteId}`);
        }
        return this.usersService.deleteUser(deleteId);
    }
}

import { Body, Controller, Delete, Get, Param, Patch, UseGuards, ValidationPipe, } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.update.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppJwtGuard } from '../security/jwt/app.jwt.guard';
import { UserId } from '../security/jwt/app.jwt.decode.user.id';
import { UserDto } from './dto/users.dto';
import { Roles } from '../security/roles/roles.decorator';
import { Role } from '../security/roles/roles.enum';
import { RolesGuard } from '../security/roles/roles.guard';

@ApiTags('Users')
@Controller('/users')
@Roles(Role.USER)
@UseGuards(AppJwtGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @Roles(Role.ADMIN)
    @ApiResponse({
        status: 200,
        description: 'The records have been successfully found.',
        type: [UserDto],
    })
    async get(): Promise<UserDto[]> {
        return await this.usersService.getAll();
    }

    @Get('/:id')
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully found.',
        type: UserDto,
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
        type: UserDto,
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
    async delete(
        @Param('id') deleteId: string,
        @UserId() commandUserId: string,
    ) {
        if (JSON.stringify(commandUserId) !== JSON.stringify(deleteId)) {
            console.log(`User ${commandUserId} delete next user: ${deleteId}`);
        }
        return {
            message: await this.usersService.deleteUser(deleteId),
        };
    }
}

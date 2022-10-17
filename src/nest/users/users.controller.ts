import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { UserDto } from './user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('all')
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Post('create')
    async createUser(@Body() createUserDto: UserDto): Promise<User> {
        return await this.usersService.create(createUserDto);
    }
}

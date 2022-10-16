import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('all')
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }
}

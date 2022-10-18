import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { UserDto } from './users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('all')
    @ApiOperation({ summary: "Get all users from DB" })
    @ApiResponse({ status: HttpStatus.OK, description: "OK", type: [UserDto] })
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Post('create')
    @ApiOperation({ summary: "Create new user into DB" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Success", type: UserDto })
    async createUser(@Body() createUserDto: UserDto): Promise<UserDto> {
        return await this.usersService.create(createUserDto)
            .then((user) => {
                return UserDto.fromEntity(user)
            });
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, description: "OK", type: UserDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Not found" })
    async findById(@Param('id') id: string): Promise<UserDto> {
        return await this.usersService
            .findById(id)
            .catch((err) => {
                throw new NotFoundException(err.message);
            });
    }
}

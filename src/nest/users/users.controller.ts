import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
Processing all requests started from /users
 */
@ApiTags('Users') // <---- Separated block USERS on Swagger for all controller's methods.
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Handle GET /users/all
     */
    @Get('all')
    @ApiOperation({ summary: "Get all users." })
    @ApiResponse({ status: HttpStatus.OK, description: "OK", type: [User] })
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    /**
     * Handle POST /users
     * @param createUserDto
     */
    @Post()
    @ApiOperation({ summary: "Create new user." })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Success", type: User })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService.create(createUserDto);
    }

    /**
     * Handle GET /users/:id
     * @param id
     */
    @Get(':id')
    @ApiOperation({ summary: "Get user by id." })
    @ApiParam({ name: "id", required: true, description: "User's identifier for getting." })
    @ApiResponse({ status: HttpStatus.OK, description: "OK", type: User })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Not found" })
    async findById(@Param('id') id: string): Promise<User> {
        return await this.usersService
            .findById(id)
            .catch((err) => {
                throw new NotFoundException(err.message);
            });
    }

    /**
     * Handle PATCH /users/:id
     * @param id
     * @param updateUserDto
     */
    @Patch(':id')
    @ApiOperation({ summary: "Update user by id." })
    @ApiParam({ name: "id", required: true, description: "User's identifier for updating." })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User | null> {
        return this.usersService.update(id, updateUserDto);
    }

    /**
     * Handle DELETE /users/:id
     * @param id
     */
    @Delete(':id')
    @ApiOperation({ summary: "Delete user by id." })
    @ApiParam({ name: "id", required: true, description: "User's identifier for deleting." })
    remove(@Param('id') id: string): Promise<User | null> {
        return this.usersService.remove(id);
    }
}

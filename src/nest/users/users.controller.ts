import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles/roles.decorator';

/**
Processing all requests started from /users
 */
@Roles('guest')
@ApiTags('Users') // <---- Separated block USERS on Swagger for all controller's methods.
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Handle GET /users/all
     */
    @Get('all')
    @ApiOperation({ summary: 'Getting all users.' })
    @ApiResponse({ status: HttpStatus.OK, description: 'OK', type: [User] })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    /**
     * Handle POST /users/create
     * @param createUserDto @see CreateUserDto
     */
    @Post('create')
    @ApiOperation({ summary: 'Create new user.' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Success',
        type: User,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    async createUser(
        @Body(ValidationPipe) createUserDto: CreateUserDto
    ): Promise<User> {
        return await this.usersService.create(createUserDto);
    }

    /**
     * Handle GET /users/:id
     * @param id
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get user by id.' })
    @ApiParam({
        name: 'id',
        required: true,
        description: "User's identifier for getting.",
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'OK', type: User })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User with 'id' does not exist. You cannot FIND it.",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    async findById(@Param('id') id: string): Promise<User> {
        return await this.usersService.findById(id).catch((err) => {
            throw new NotFoundException(err.message);
        });
    }

    /**
     * Handle PATCH /users/:id
     * @param id
     * @param updateUserDto
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update user by id.' })
    @ApiParam({
        name: 'id',
        required: true,
        description: "User's identifier for updating.",
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User with 'id' does not exist. You cannot PATCH it.",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    async update(
        @Param('id') id: string,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto
    ): Promise<User | null> {
        return await this.usersService
            .update(id, updateUserDto)
            .catch((err) => {
                throw new NotFoundException(err.message);
            });
    }

    /**
     * Handle DELETE /users/:id
     * @param id
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by id.' })
    @ApiParam({
        name: 'id',
        required: true,
        description: "User's identifier for deleting.",
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    async remove(@Param('id') id: string): Promise<User | null> {
        return await this.usersService.remove(id);
    }
}

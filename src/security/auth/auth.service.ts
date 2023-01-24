import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { SignInDto } from './dto/auth.user.signin.dto';
import { AppJwtService } from '../jwt/app.jwt.service';
import { AppJwtData } from '../jwt/app.jwt.data';
import { CreateUserDto } from './dto/auth.user.create.dto';
import { User } from '../../users/users.schema';
import { JwtDto } from '../jwt/dto/JwtDto';
import { UserDto } from '../../users/dto/users.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private appJwtService: AppJwtService,
    ) {}

    /**
     * Try to sign in user through validation his password.
     * In success will return encrypted jwt token. Fronted must add this token to all next requests.
     * @param signInDto SignInDto
     */
    async authUser(signInDto: SignInDto): Promise<JwtDto> {
        const error = new BadRequestException('Check phone or password');

        const user: User = await this.userService.getUserByPhoneWithPassword(
            signInDto.phone,
        );
        if (!user) {
            throw error;
        }

        const isPasswordValid = await user.isPasswordValid(signInDto.password);
        if (!isPasswordValid) {
            throw error;
        }

        const data = { id: user['_id'] } as AppJwtData;
        const jwtToken = this.appJwtService.sign(data);
        return { jwtToken: jwtToken };
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        return this.userService.createUser(createUserDto);
    }
}

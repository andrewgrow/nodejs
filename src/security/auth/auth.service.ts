import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { SignInDto } from './dto/signin.dto';
import { AppJwtService } from '../jwt/app.jwt.service';
import { AppJwtData } from '../jwt/app.jwt.data';
import { CreateUserDto } from './dto/create.dto';

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
  async authUser(signInDto: SignInDto): Promise<any> {
    const error = new BadRequestException('Check phone or password');

    const user = await this.userService.getUserByPhone(signInDto.phone);
    if (!user) {
      throw error;
    }

    const isPasswordValid = await user.isPasswordValid(signInDto.password);
    if (!isPasswordValid) {
      throw error;
    }

    const data = { id: user['_id'] };
    const jwtToken = this.appJwtService.sign(data as AppJwtData);
    return JSON.stringify({ jwtToken: jwtToken });
  }

  async createUser(createUserDto: CreateUserDto) {
    // delegate this work to a special service
    return this.userService.createUser(createUserDto);
  }
}

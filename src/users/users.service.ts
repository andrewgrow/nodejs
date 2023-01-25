import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from '../security/auth/dto/auth.user.create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTelegram } from './users.telegram.schema';
import { UserDto } from './dto/users.dto';
import { Role } from '../security/roles/roles.enum';

@Injectable()
export class UsersService {
    @InjectModel(User.name)
    private userModel: Model<UserDocument>;

    async getAll(): Promise<UserDto[]> {
        const users: User[] = await this.userModel.find().exec();
        return users.map((raw) => {
            return new UserDto(raw);
        });
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        if (await this.isPhoneAlreadyExist(createUserDto.phone)) {
            throw new ConflictException(
                'Phone is already taken. Set other phone or log in.',
            );
        }

        let user = new this.userModel(createUserDto);
        await user.validate();

        user = await user.save();
        return new UserDto(user);
    }

    private async isPhoneAlreadyExist(phone: string): Promise<boolean> {
        const result = await this.userModel.findOne({ phone: phone }).exec();
        return result !== null;
    }

    async updateUser(id, updateUserDto): Promise<UserDto> {
        const userDb = await this.userModel.findById(id).exec();

        if (userDb === null) {
            throw new NotFoundException(
                `User with id ${id} not found for patching.`,
            );
        }

        // todo: 2023.01.23: need to change updating properties with lodash _get method https://www.geeksforgeeks.org/lodash-_-get-method/

        if (updateUserDto.name) {
            userDb.name = updateUserDto.name;
        }
        if (updateUserDto.phone) {
            userDb.phone = updateUserDto.phone;
        }
        if (updateUserDto.password) {
            userDb.password = updateUserDto.password;
        }

        if (updateUserDto.telegram) {
            if (!userDb.telegram) {
                userDb.telegram = new UserTelegram();
            }
            if (updateUserDto.telegram.chatId) {
                userDb.telegram.chatId = updateUserDto.telegram.chatId;
            }
            if (updateUserDto.telegram.userName) {
                userDb.telegram.userName = updateUserDto.telegram.userName;
            }
            if (updateUserDto.telegram.publicName) {
                userDb.telegram.publicName = updateUserDto.telegram.publicName;
            }
        }

        const user: User = await userDb.save();
        return new UserDto(user);
    }

    async deleteUser(id): Promise<string> {
        const result = await this.userModel.findByIdAndDelete(id).exec();

        if (result === null) {
            throw new NotFoundException('User account not found for deleting!');
        }

        return 'Your account has been deleted. Good bye!';
    }

    async getUserById(id): Promise<UserDto> {
        const result: User = await this.userModel.findById(id).exec();
        if (result === null) {
            throw new NotFoundException(`User with id ${id} not found.`);
        }
        return new UserDto(result);
    }

    async getUserByPhone(phone): Promise<UserDto> {
        const user = await this.userModel.findOne({ phone: phone }).exec();
        return new UserDto(user);
    }

    getUserByPhoneWithPassword(phone): Promise<User> {
        return this.userModel
            .findOne({ phone: phone })
            .select('+password')
            .exec();
    }

    async getUserRole(userId: string): Promise<Role> {
        const result = await this.userModel
            .findById(userId)
            .select('role')
            .exec();
        if (result.role) {
            return result.role;
        }
        return Role.USER;
    }

    async setUserRole(userId: string, role: Role) {
        return this.userModel
            .findOneAndUpdate({ _id: userId }, { role: role })
            .exec();
    }
}

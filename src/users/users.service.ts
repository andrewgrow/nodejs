import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from '../security/auth/dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    @InjectModel(User.name)
    private userModel: Model<UserDocument>;

    async getAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        if (await this.isPhoneAlreadyExist(createUserDto.phone)) {
            throw new ConflictException(
                'Phone is already taken. Set other phone or log in.',
            );
        }

        const user = new this.userModel(createUserDto);
        await user.validate();

        return user.save();
    }

    private async isPhoneAlreadyExist(phone: string) {
        const result = await this.userModel.findOne({ phone: phone });
        return result !== null;
    }

    async updateUser(id, updateUserDto): Promise<User> {
        const userDb = await this.userModel.findById(id);

        if (userDb === null) {
            throw new NotFoundException(
                `User with id ${id} not found for patching.`,
            );
        }

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

        return userDb.save();
    }

    async deleteUser(id) {
        const result = await this.userModel.findByIdAndDelete(id);

        if (result === null) {
            throw new NotFoundException('User account not found for deleting!');
        }

        return {
            message: 'Your account has been deleted. Good bye!',
        };
    }

    async getUserById(id): Promise<User> {
        const result: User = await this.userModel.findById(id);
        if (result === null) {
            throw new NotFoundException(`User with id ${id} not found.`);
        }
        return result;
    }

    async getUserByPhone(phone): Promise<User> {
        const result = await this.userModel.findOne({ phone: phone }).exec();
        return result;
    }

    async getUserByPhoneWithPassword(phone): Promise<User> {
        const result = await this.userModel
            .findOne({ phone: phone })
            .select('+password')
            .exec();
        return result;
    }
}

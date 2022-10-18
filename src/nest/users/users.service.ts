import { Model, SchemaTypes } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { UserDto } from './users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<UserDocument>
    ) {}

    async create(createUserDto: UserDto): Promise<User> {
        const createdUser: UserDocument = new this.UserModel(UserDto.toEntity(createUserDto));
        return await createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return await this.UserModel.find().exec();
    }

    async findById(id: string) {
        const user: User | null = await this.UserModel.findById(id).exec();
        if (user) return UserDto.fromEntity(user);
        throw new Error(`User with id '${id}' does not exist.`);
    }
}

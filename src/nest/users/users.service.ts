import { Model, SchemaTypes } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<UserDocument>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser: UserDocument = new this.UserModel(createUserDto);
        return await createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return await this.UserModel.find().exec();
    }

    async findById(id: string): Promise<User> {
        const user: User | null = await this.UserModel.findById(id).exec();
        if (user) return user;
        throw new Error(`User with id '${id}' does not exist.`);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        return await this.UserModel.findByIdAndUpdate(id, updateUserDto).exec();
    }

    async remove(id: string): Promise<User | null> {
        return await this.UserModel.findByIdAndRemove(id).exec();
    }
}

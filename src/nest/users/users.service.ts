import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    // async create(createUserDto: CreateUserDto): Promise<User> {
    //     const createdUser = new this.userModel(createUserDto);
    //     return createdUser.save();
    // }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }
}

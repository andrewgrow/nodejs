import { ApiProperty } from '@nestjs/swagger';
import { UserTelegram } from '../users.telegram.schema';
import { IUser } from '../interfaces/IUser';
import { User } from '../users.schema';

export class UserDto implements IUser {
    @ApiProperty({
        description: 'The id of a user.',
        type: String,
        example: '63cf8ad161070a1c1b2ac998',
    })
    _id: string;

    @ApiProperty({
        description: 'The name of a user.',
        type: String,
        example: 'John',
    })
    name: string;

    @ApiProperty({
        description: 'The phone of a user.',
        type: String,
        example: '+594 700 XXX XXX XXX (without spaces)',
    })
    phone: string;

    @ApiProperty({
        description: 'The telegram data of a user.',
        type: UserTelegram,
    })
    telegram: UserTelegram;

    password() {
        return null;
    }

    constructor(user: User) {
        this._id = user['_id'];
        this.name = user.name;
        this.phone = user.phone;
        this.telegram = user.telegram;
    }
}

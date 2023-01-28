import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserTelegram } from './interfaces/users.telegram';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class UserTelegram implements IUserTelegram {
    @ApiProperty({
        description: 'The chat id of a user.',
        type: Number,
        example: '1234567890',
    })
    @Prop({ required: true })
    chatId: number;

    @ApiProperty({
        description: 'The public name of a user.',
        type: String,
        example: 'John',
    })
    @Prop()
    publicName?: string;

    @ApiProperty({
        description: 'Username in Telegram used as @john1980.',
        type: String,
        example: 'john1980',
    })
    @Prop()
    userName?: string;
}

export const userTelegramSchema = SchemaFactory.createForClass(UserTelegram);

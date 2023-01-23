import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUserTelegram } from './interfaces/users.telegram';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class UserTelegram implements IUserTelegram {
    @Prop({ required: true })
    chatId: number;

    @Prop()
    publicName?: string;

    @Prop()
    userName?: string;
}

const userTelegramSchema = SchemaFactory.createForClass(UserTelegram);

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ type: userTelegramSchema })
    telegram: UserTelegram;

    /**
     * Check is decrypted password match to encrypted password at a model.
     * See an implementation method below.
     */
    isPasswordValid: (decryptedPassword: string) => Promise<boolean>;
}

export const UsersSchema = SchemaFactory.createForClass(User);

/**
 * Encrypt password during save model.
 */
UsersSchema.pre<UserDocument>('save', async function (next) {
    const user = this as UserDocument;
    if (this.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

/**
 * Check is decrypted password match to encrypted password at a model.
 * Here is an implementation of the method.
 */
UsersSchema.methods.isPasswordValid = async function (
    decryptedPassword: string,
): Promise<boolean> {
    return await bcrypt.compare(decryptedPassword, this.password);
};

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserTelegram, userTelegramSchema } from './users.telegram.schema';
import { IUser } from './interfaces/IUser';
import { Role } from '../security/roles/roles.enum';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements IUser {
    @Prop()
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ type: userTelegramSchema })
    telegram: UserTelegram;

    @Prop({ type: String, enum: Role, default: Role.USER })
    role: Role;

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
    // this is an UserDocument
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
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

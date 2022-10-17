import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    _id: string;
    @Prop() name: string;
    @Prop() phone: string;
    @Prop() createdAt: Date;
    @Prop() updatedAt: Date;
    @Prop() deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

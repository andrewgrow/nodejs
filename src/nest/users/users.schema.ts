import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

/* eslint indent: "off" -- At the current moment parameters with decorators wrongly indented. Known issue. */
@Schema({ timestamps: true })
export class User {
    @ApiProperty({ description: "User's identifier." })
    _id: string;

    @ApiProperty({ description: "User's name." })
    @Prop()
    name: string;

    @ApiProperty({ description: "User's phone." })
    @Prop()
    phone: string;

    @ApiProperty({ description: "User's create date." })
    @Prop()
    createdAt: Date;

    @ApiProperty({ description: "User's update date." })
    @Prop()
    updatedAt: Date;

    @ApiProperty({ description: "User's updating version." })
    _v: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

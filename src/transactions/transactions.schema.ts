import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITransaction } from './transactions.interface';
import { TransactionType } from './transactions.type';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction implements ITransaction {
    @Prop({ required: true })
    contractor_id: string;

    @Prop({ required: true })
    sum: number;

    @Prop({ required: true, enum: TransactionType })
    type: TransactionType;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

import * as Telegram from '../api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelegramUpdateDocument = HydratedDocument<TelegramUpdate>;

/**
 * Model that contains object the Update from Telegram polling updates.
 * When you call the Telegram with method update() you receive back this Update object.
 */
@Schema({ collection: 'telegramUpdates' })
export class TelegramUpdate implements Telegram.Update {
    @Prop()
    update_id: number;

    @Prop()
    data: string;
}

export const TelegramUpdateSchema =
    SchemaFactory.createForClass(TelegramUpdate);

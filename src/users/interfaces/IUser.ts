import { UserTelegram } from '../users.telegram.schema';

export interface IUser {
    name: string;

    phone: string;

    telegram: UserTelegram;
}

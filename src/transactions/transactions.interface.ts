import { TransactionType } from './transactions.type';

export interface ITransaction {
    contractor_id: string;

    sum: number;

    type: TransactionType;
}

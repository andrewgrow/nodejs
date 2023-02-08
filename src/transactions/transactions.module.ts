import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app.config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transactions.schema';
import { TransactionsController } from './transactions.controller';
import { AppJwtModule } from '../security/jwt/app.jwt.module';
import { User, UsersSchema } from '../users/users.schema';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
            { name: User.name, schema: UsersSchema }, // used in RolesGuard
        ]),
        AppJwtModule,
    ],
    controllers: [TransactionsController],
})
export class TransactionsModule {}

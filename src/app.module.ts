/**
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDatabaseConfig } from './nest/database/database.config.interface';

const mongo: IDatabaseConfig = {
    dbname: process.env.DB_MONGO_NAME ?? 'mongotest',
    user: process.env.DB_MONGO_USER ?? 'mongouser',
    password: process.env.DB_MONGO_PASSWORD ?? 'mongopassword',
    host: process.env.DB_MONGO_HOST ?? 'localhost',
    port: process.env.DB_MONGO_PORT ?? '27017',
};
const mongoUri = `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}`;

@Module({
    imports: [ MongooseModule.forRoot(mongoUri) ],
    controllers: [],
    providers: [],
})
export class AppModule {}
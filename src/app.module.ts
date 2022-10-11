/**
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import {DatabaseConfig} from "./nest/database/database.config";

@Module({
    imports: [],
    controllers: [],
    providers: [ DatabaseConfig ],
})
export class AppModule {}
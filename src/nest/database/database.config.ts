import { Injectable } from "@nestjs/common";
import { IDatabaseConfig } from "./database.config.interface";

type SelectConfig = 'MYSQL' | 'MONGO';

/**
 * Provides databases configuration data.
 */
@Injectable()
export class DatabaseConfig {

    private readonly _configMySql: IDatabaseConfig;
    private readonly _configMongo: IDatabaseConfig;

    constructor() {
        this._configMySql = prepareConfig('MYSQL');
        this._configMongo = prepareConfig('MONGO');
    }

    public get configMySql() {
        return this._configMySql;
    }

    public get configMongo() {
        return this._configMongo;
    }
}

function prepareConfig(select: SelectConfig): IDatabaseConfig {
    switch (select) {
        case 'MYSQL' : return {
            name: process.env.DB_NAME ?? 'divotest',
            user: process.env.DB_USER ?? 'dbtestuser',
            password: process.env.DB_PASSWORD ?? 'dbtestpassword',
            host: process.env.DB_HOST ?? 'localhost',
            port: process.env.DB_PORT ?? '3306',
        };
        case 'MONGO' : return {
            name: process.env.DB_MONGO_NAME ?? 'mongotest',
            user: process.env.DB_MONGO_USER ?? 'mongouser',
            password: process.env.DB_MONGO_PASSWORD ?? 'mongopassword',
            host: process.env.DB_MONGO_HOST ?? 'localhost',
            port: process.env.DB_MONGO_PORT ?? '27017',
        };
        default: throw new Error('You must select configuration that exists.');
    }
}
import * as Joi from 'joi';
import { ENVIRONMENT } from './enums/app.env';

/**
 * To getting a configuration in your class need to do:
 * 1. In a feature module import the configuration module:
 * @Module({
 *   imports: [ConfigModule],
 * })
 *
 * 2. In a feature class inject the config service:
 * constructor(private configService: ConfigService) {}
 *
 * 3. Call something that: this.configService.get<string>('database.name')
 */
export const configuration = () => ({
    database: {
        name: isTestEnv()
            ? `${process.env.MONGO_DB_DATABASE_NAME}-test`
            : process.env.MONGO_DB_DATABASE_NAME,
        uri: `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}`,
    },
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
        expiresInSeconds: 60 * 60 * 24 * 365, // Seconds. 3600 is 1 hour.
    },
    telegramBotKey: isTestEnv()
        ? 'TEST'
        : process.env.TELEGRAM_TOKEN || 'YOU HAVE TO DEFINE BOT KEY',
});

/**
 * Check that configuration was loaded successful or throw exception during starting.
 */
export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .lowercase()
        .valid(ENVIRONMENT.DEV, ENVIRONMENT.PRODUCTION, ENVIRONMENT.TEST)
        .default(ENVIRONMENT.DEV),
    PORT: Joi.number().default(3000),
});

function isTestEnv(): boolean {
    return process.env.NODE_ENV === ENVIRONMENT.TEST;
}

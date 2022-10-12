import { registerAs } from '@nestjs/config';

/**
 * Registers the configuration object behind a specified token ('db_mongo_config').
 * @returns MongooseModuleOptions
 */
export default registerAs('db_mongo_config', () => ({
    uri: process.env.MONGO_URI,
}));
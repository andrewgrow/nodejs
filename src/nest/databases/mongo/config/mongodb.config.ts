import { registerAs } from '@nestjs/config';
import { DB_CONFIGURATION_TOKEN } from './mongodb.constants';

/**
 * Registers the configuration object behind a specified token ('db_mongo_config').
 * @returns MongooseModuleOptions
 */
export default registerAs(DB_CONFIGURATION_TOKEN, () => ({
    uri: process.env.MONGO_URI,
}));
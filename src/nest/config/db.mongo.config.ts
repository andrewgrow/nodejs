import { registerAs } from '@nestjs/config';

// @returns MongooseModuleOptions
export default registerAs('db_mongo_config', () => ({
    uri: process.env.MONGO_URI,
}));
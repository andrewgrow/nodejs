import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthHeaderApiKeyStrategy } from './auth-header-api-key.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [PassportModule, ConfigModule],
    providers: [AuthHeaderApiKeyStrategy],
})
export class AuthorizationModule {}

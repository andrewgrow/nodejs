import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthHeaderApiKeyStrategy } from './auth-header-api-key.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthHeaderApiGuard } from './auth-header-api-guard';

@Module({
    imports: [PassportModule, ConfigModule],
    providers: [AuthHeaderApiKeyStrategy, AuthHeaderApiGuard],
    exports: [AuthHeaderApiGuard]
})
export class AuthorizationModule {}

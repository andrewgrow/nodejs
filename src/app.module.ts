import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './security/auth/auth.module';
import { AppConfigModule } from './config/app.config.module';
import { PagesModule } from './pages/pages.module';

@Module({
    imports: [AppConfigModule, UsersModule, AuthModule, PagesModule],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'process';

async function startApplication(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(helmet());

    enableView(app, join(__dirname, '../..', 'views'));
    enableSwagger(app);

    await app.listen(3000);
}

// starting!
startApplication().then();

/**
 * Enable view engine for the application.
 */
export function enableView(app: NestExpressApplication, viewPath: string) {
    app.setBaseViewsDir(viewPath);
    app.setViewEngine('hbs');
}

/**
 * In production swagger have to be disabled for security reasons.
 */
function enableSwagger(app: NestExpressApplication): void {
    // running development only
    if (process.env.NODE_ENV !== 'development') {
        return;
    }
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Divo Server')
        .setDescription('The server API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger-docs', app, document);
}

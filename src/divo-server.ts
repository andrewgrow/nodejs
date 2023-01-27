import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(helmet());

    app.useStaticAssets(join(__dirname, '../..', 'static'));
    app.setBaseViewsDir(join(__dirname, '../..', 'views'));
    app.setViewEngine('hbs');

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Divo Server')
        .setDescription('The server API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger-docs', app, document);

    await app.listen(3000);
}
bootstrap();

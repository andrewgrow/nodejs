import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { enableView } from '../src/divo-server';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        enableView(
            app as NestExpressApplication,
            join(__dirname, '..', 'views'),
        );

        await app.init();
    });

    describe('GET / (main page)', () => {
        it('Should return 200 and have demo app text', async () => {
            const response = await request(app.getHttpServer())
                .get('/')
                .expect(200);

            expect(response.text).toContain('demo app');
        });
    });

    describe('GET /random_page', () => {
        it('Should return 404 because this page does not exist', async () => {
            await request(app.getHttpServer()).get('/random_page').expect(404);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

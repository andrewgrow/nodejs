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
        it('Should return 200 and have hello text', async () => {
            const response = await request(app.getHttpServer())
                .get('/')
                .expect(200);

            expect(response.text).toContain('demo app');
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

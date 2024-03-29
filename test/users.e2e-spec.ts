import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../src/users/users.module';
import { ContextIdFactory } from '@nestjs/core';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/users.schema';
import { CreateUserDto } from '../src/security/auth/dto/auth.user.create.dto';
import { AppJwtService } from '../src/security/jwt/app.jwt.service';
import { AppJwtData } from '../src/security/jwt/app.jwt.data';
import { UserDto } from '../src/users/dto/users.dto';
import { Role } from '../src/security/roles/roles.enum';

describe('Users Routes', () => {
    let app: INestApplication;
    let usersService: UsersService;
    let appJwtService: AppJwtService;
    let user: UserDto;
    let jwtToken: string;
    let userId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UsersModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        // getting service in this module context
        const contextId = ContextIdFactory.create();
        jest.spyOn(ContextIdFactory, 'getByRequest').mockImplementation(
            () => contextId,
        );
        usersService = await moduleRef.resolve(UsersService, contextId);
        appJwtService = await moduleRef.resolve(AppJwtService, contextId);

        const userDto: CreateUserDto = {
            phone: '+380631234567',
            name: 'UserName',
            password: 'Qwerty123',
            telegram: {
                chatId: 123456789,
                userName: 'testName',
                publicName: 'Test Telegram Name',
            },
        };
        user = await usersService.createUser(userDto);
        userId = user['_id'].toString();

        const data = { id: userId };
        jwtToken = appJwtService.sign(data as AppJwtData);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Check JWT protection with 403 code', () => {
        const bodyError = {
            statusCode: 403,
            message:
                'VerifyRequestHeaders fail. You forgot add Auth Bearer token?',
        };

        it('GET /users should be protected!', () => {
            return request(app.getHttpServer())
                .get('/users')
                .expect(403)
                .expect(bodyError);
        });

        it('GET /users/{id} should be protected!', () => {
            return request(app.getHttpServer())
                .get('/users/{id}')
                .expect(403)
                .expect(bodyError);
        });

        it('PATCH /users/{id} should be protected!', () => {
            return request(app.getHttpServer())
                .patch('/users/{id}')
                .expect(403)
                .expect(bodyError);
        });

        it('DELETE /users/{id} should be protected!', () => {
            return request(app.getHttpServer())
                .delete('/users/{id}')
                .expect(403)
                .expect(bodyError);
        });
    });

    describe('Check role protection', () => {
        it('GET /users should be protected from simple users', async () => {
            const response = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(403);

            const error = response.body;

            expect(error).toEqual({
                statusCode: 403,
                message: 'Your role is restricted for this access point.',
                error: 'Forbidden',
            });
        });
    });

    describe('check correct responses', () => {
        it('GET /users should return a list of users with one value', async () => {
            await usersService.setUserRole(userId, Role.ADMIN);
            const response = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200);

            const responseBody: User[] = response.body as User[];
            const responseUser = responseBody[0] as User;
            const responseUserId = responseUser['_id'];

            expect(responseUserId).toEqual(userId);
        });

        it('GET /users/{id} should return one user', async () => {
            const response = await request(app.getHttpServer())
                .get(`/users/${user['_id']}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200);

            const responseUser = response.body as User;
            const responseUserId = responseUser['_id'];

            expect(responseUserId).toEqual(userId);
        });

        it('PATCH /users/{id} should update user', async () => {
            const newName = 'New Name Test';
            const response = await request(app.getHttpServer())
                .patch(`/users/${user['_id']}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .send({
                    name: newName,
                    telegram: { publicName: newName },
                })
                .expect(200);

            const responseUser = response.body as User;
            const responseUserName = responseUser.name;
            const responseTelegramName = responseUser.telegram.publicName;

            const userName = user.name;
            const tgName = user.telegram.publicName;

            expect(responseUserName).not.toEqual(userName);
            expect(responseUserName).toEqual(newName);

            expect(responseTelegramName).not.toEqual(tgName);
            expect(responseTelegramName).toEqual(newName);
        });

        it('DELETE /users/{id} should return OK and clear user', async () => {
            const response = await request(app.getHttpServer())
                .delete(`/users/${user['_id']}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200);
            expect(response.body.message).toEqual(
                'Your account has been deleted. Good bye!',
            );
        });
    });
});

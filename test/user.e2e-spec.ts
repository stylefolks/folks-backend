/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e) 테스트', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('signup and verify email', async () => {
    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'testuser2@example.com',
        username: 'testuser',
        password: '1234',
      });

    expect(signup.status).toBe(201);

    const codeRes = await request(app.getHttpServer())
      .post('/auth/request-email-verification')
      .send({ email: 'testuser2@example.com' });
    const code = codeRes.body.code as string;

    const verify = await request(app.getHttpServer())
      .post('/auth/verify-email')
      .send({ email: 'testuser2@example.com', code });
    expect(verify.status).toBe(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'testuser2@example.com', password: '1234' });
    expect(login.status).toBe(201);
    expect(login.body).toHaveProperty('accessToken');
  });
});

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
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

  it('POST /user/signup', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send({
        email: 'testuser2@example.com',
        username: 'testuser',
        password: '1234',
      });

    expect(response.status).toBe(201); // default는 201 Created
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('testuser2@example.com');
  });

  it('POST /user/login', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: 'testuser2@example.com',
        password: '1234',
      });

    expect(response.status).toBe(201); // 또는 200
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('testuser2@example.com');
  });
});

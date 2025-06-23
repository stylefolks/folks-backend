/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('EventController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let crewId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const signup = await request(app.getHttpServer())
      .post('/user/signup')
      .send({ email: 'event@test.com', username: 'eventer', password: '1234' });
    token = signup.body.accessToken;

    const crew = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'event crew' });
    crewId = crew.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/crew/:crewId/events (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post(`/crew/${crewId}/events`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'party', date: new Date().toISOString() });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('/crew/:crewId/events (GET)', async () => {
    const res = await request(app.getHttpServer()).get(`/crew/${crewId}/events`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

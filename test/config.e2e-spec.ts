import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ConfigController (e2e)', () => {
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

  it('/config/post-types (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/config/post-types');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('TALK');
  });

  it('/config/user-roles (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/config/user-roles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('USER');
  });

  it('/config/crew-status (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/config/crew-status');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('ACTIVE');
  });

  it('/config/post-visibility (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/config/post-visibility');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('PUBLIC');
  });
});

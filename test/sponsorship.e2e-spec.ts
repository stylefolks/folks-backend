import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('SponsorshipController (e2e)', () => {
  let app: INestApplication;
  let crewId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'sponsor@test.com',
        username: 'sponsor',
        password: '1234',
      });
    token = signup.body.accessToken;

    const crew = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'sponsor crew' });
    crewId = crew.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/sponsorships/validate (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/sponsorships/validate')
      .set('Authorization', `Bearer ${token}`)
      .send({ crewId, amount: 3000 });

    expect(res.status).toBe(201);
    expect(res.body.valid).toBe(true);
  });
});

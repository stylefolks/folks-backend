/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('CrewController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/crew (POST)', async () => {
    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'crewtest@example.com',
        username: 'crewuser',
        password: '1234',
      });

    const userId = signup.body.id as string;
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'INFLUENCER', status: 'ACTIVE' },
    });

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'crewtest@example.com', password: '1234' });
    const token = login.body.accessToken;

    const res = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'my crew' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('fails when creating a second crew', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'crewtest@example.com', password: '1234' });
    const token = login.body.accessToken;

    await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'dup crew' });

    const res = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'another crew' });

    expect(res.status).toBe(400);
  });

  it('fails when user role is not influencer', async () => {
    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'normal@example.com',
        username: 'normal',
        password: '1234',
      });
    const userId = signup.body.id as string;
    await prisma.user.update({ where: { id: userId }, data: { status: 'ACTIVE' } });

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'normal@example.com', password: '1234' });
    const token = login.body.accessToken;

    const res = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'should fail' });

    expect(res.status).toBe(400);
  });

  it('/crew/:id (GET)', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'crewtest@example.com', password: '1234' });
    const token = login.body.accessToken;

    const create = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'second crew' });

    const crewId = create.body.id;

    const res = await request(app.getHttpServer()).get(`/crew/${crewId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(crewId);
  });

  it('/crew/:id (PATCH)', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'crewtest@example.com', password: '1234' });
    const token = login.body.accessToken;

    const create = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'third crew' });

    const crewId = create.body.id;

    const res = await request(app.getHttpServer())
      .patch(`/crew/${crewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'updated' });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe('updated');
  });

  it('/crew/:id (DELETE)', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'crewtest@example.com', password: '1234' });
    const token = login.body.accessToken;

    const create = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'delete crew' });

    const crewId = create.body.id;

    const res = await request(app.getHttpServer())
      .delete(`/crew/${crewId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

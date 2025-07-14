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

  it('/crew?sort=popular (GET)', async () => {
    const server = app.getHttpServer();

    const s1 = await request(server)
      .post('/auth/signup')
      .send({ email: 'pop1@test.com', username: 'pop1', password: '1234' });
    const owner1 = s1.body.id as string;
    await prisma.user.update({
      where: { id: owner1 },
      data: { role: 'INFLUENCER', status: 'ACTIVE' },
    });
    const l1 = await request(server)
      .post('/auth/login')
      .send({ email: 'pop1@test.com', password: '1234' });
    const t1 = l1.body.accessToken;
    const c1 = await request(server)
      .post('/crew')
      .set('Authorization', `Bearer ${t1}`)
      .send({ name: 'popular1' });
    const crew1Id = c1.body.id as string;

    const s2 = await request(server)
      .post('/auth/signup')
      .send({ email: 'pop2@test.com', username: 'pop2', password: '1234' });
    const owner2 = s2.body.id as string;
    await prisma.user.update({
      where: { id: owner2 },
      data: { role: 'INFLUENCER', status: 'ACTIVE' },
    });
    const l2 = await request(server)
      .post('/auth/login')
      .send({ email: 'pop2@test.com', password: '1234' });
    const t2 = l2.body.accessToken;
    await request(server)
      .post('/crew')
      .set('Authorization', `Bearer ${t2}`)
      .send({ name: 'popular2' });

    const m1 = await request(server)
      .post('/auth/signup')
      .send({ email: 'mem1@test.com', username: 'mem1', password: '1234' });
    await prisma.user.update({ where: { id: m1.body.id }, data: { status: 'ACTIVE' } });
    const lm1 = await request(server)
      .post('/auth/login')
      .send({ email: 'mem1@test.com', password: '1234' });
    await request(server)
      .post(`/crew/${crew1Id}/join`)
      .set('Authorization', `Bearer ${lm1.body.accessToken}`);

    const m2 = await request(server)
      .post('/auth/signup')
      .send({ email: 'mem2@test.com', username: 'mem2', password: '1234' });
    await prisma.user.update({ where: { id: m2.body.id }, data: { status: 'ACTIVE' } });
    const lm2 = await request(server)
      .post('/auth/login')
      .send({ email: 'mem2@test.com', password: '1234' });
    await request(server)
      .post(`/crew/${crew1Id}/join`)
      .set('Authorization', `Bearer ${lm2.body.accessToken}`);

    const res = await request(server).get('/crew?sort=popular');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].id).toBe(crew1Id);
    expect(res.body[0]._count.members).toBe(2);
  });
});

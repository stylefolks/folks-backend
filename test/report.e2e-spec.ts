import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ReportController (e2e)', () => {
  let app: INestApplication;
  let postId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const author = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'reportauthor@test.com',
        username: 'author',
        password: '1234',
      });

    const token = author.body.accessToken;

    const post = await request(app.getHttpServer())
      .post('/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'TALK',
        title: 'hello',
        content: {},
      });

    postId = post.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('auto flags post after multiple reports', async () => {
    for (let i = 0; i < 5; i++) {
      const resSignup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: `reporter${i}@test.com`,
          username: `reporter${i}`,
          password: '1234',
        });

      const token = resSignup.body.accessToken;

      await request(app.getHttpServer())
        .post('/reports')
        .set('Authorization', `Bearer ${token}`)
        .send({
          targetType: 'POST',
          targetId: postId,
          reason: 'SPAM',
        });
    }

    const postRes = await request(app.getHttpServer()).get(`/post/${postId}`);
    expect(postRes.body.visibility).toBe('REPORTED');
    expect(postRes.body.isFlagged).toBe(true);
  });

  it('admin resolves report', async () => {
    const pendingList = await request(app.getHttpServer()).get('/reports');
    expect(pendingList.body.length).toBeGreaterThan(0);

    const reportId = pendingList.body[0].id;
    const resolved = await request(app.getHttpServer())
      .patch(`/reports/${reportId}/resolve`)
      .send();

    expect(resolved.body.status).toBe('REVIEWED');
  });
});

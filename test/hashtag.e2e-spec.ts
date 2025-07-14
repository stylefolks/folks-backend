import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('HashtagController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'tag@test.com', username: 'tagger', password: '1234' });
    token = signup.body.accessToken;

    const server = app.getHttpServer();
    await request(server)
      .post('/post')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'TALK', title: 'p1', content: {}, tagNames: ['#hot'] });
    await request(server)
      .post('/post')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'TALK', title: 'p2', content: {}, tagNames: ['#hot'] });
    await request(server)
      .post('/post')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'TALK', title: 'p3', content: {}, tagNames: ['#cool'] });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/hashtag/hot (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/hashtag/hot');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('#hot');
    expect(res.body[0]._count.postTags).toBe(2);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });
});

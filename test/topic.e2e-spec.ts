import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TopicController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let crewId: string;
  let tabId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'topic@test.com', username: 'topicer', password: '1234' });
    token = signup.body.accessToken;

    const crew = await request(app.getHttpServer())
      .post('/crew')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'topic crew' });
    crewId = crew.body.id;

    const tab = await request(app.getHttpServer())
      .post(`/crew/${crewId}/tabs`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'topic tab', type: 'TOPIC', order: 1 });
    tabId = tab.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/topics (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({ hashtag: '#test', tabIds: [tabId] });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

    const tabs = await request(app.getHttpServer()).get(`/crew/${crewId}/tabs`);
    expect(tabs.body[0].hashtag).toBe('#test');
  });
});

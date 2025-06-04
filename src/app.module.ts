import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CrewModule } from './crew/crew.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 환경변수 전역 등록
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    CrewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

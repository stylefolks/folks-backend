import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CrewModule } from './crew/crew.module';
import { CommentModule } from './comment/comment.module';
import { EventModule } from './event/event.module';
import { CrewMemberModule } from './crew-member/crew-member.module';
import { CrewPermissionModule } from './crew-permission/crew-permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 환경변수 전역 등록
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    CrewModule,
    EventModule,
    CrewPermissionModule,
    CrewMemberModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

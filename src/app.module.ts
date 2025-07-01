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
import { CrewTabModule } from './crew-tab/crew-tab.module';
import { CrewPermissionModule } from './crew-permission/crew-permission.module';
import { ReportModule } from './report/report.module';
import { SponsorshipModule } from './sponsorship/sponsorship.module';
import { NotificationTemplateModule } from './notification-template/notification-template.module';

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
    CrewTabModule,
    SponsorshipModule,
    ReportModule,
    NotificationTemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

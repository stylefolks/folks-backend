import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [PostController],
  providers: [
    PostService,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [PostService],
})
export class PostModule {}

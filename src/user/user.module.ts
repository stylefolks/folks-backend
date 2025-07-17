import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { PostModule } from 'src/post/post.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => PostModule)],
  providers: [UserService, FollowService],
  controllers: [UserController, FollowController],
})
export class UserModule {}

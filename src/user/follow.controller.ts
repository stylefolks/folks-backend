import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { FollowService } from './follow.service';

@Controller('users')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':id/followers')
  getFollowers(@Param('id') id: string) {
    return this.followService.getFollowers(id);
  }

  @Get(':id/following')
  getFollowing(@Param('id') id: string) {
    return this.followService.getFollowing(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  follow(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.followService.follow(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unfollow')
  unfollow(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.followService.unfollow(req.user.id, id);
  }
}

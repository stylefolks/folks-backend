import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: { select: { id: true, username: true } },
      },
    });
  }

  getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: { select: { id: true, username: true } },
      },
    });
  }

  async follow(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new HttpException('Cannot follow yourself', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prisma.follow.create({
        data: { followerId: userId, followingId: targetId },
      });
    } catch (err) {
      // ignore duplicate follow
    }
    return { followerId: userId, followingId: targetId };
  }

  async unfollow(userId: string, targetId: string) {
    await this.prisma.follow.delete({
      where: { followerId_followingId: { followerId: userId, followingId: targetId } },
    }).catch(() => {});
  }
}

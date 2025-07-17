import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from 'src/prisma/user-status';
import { UserRole } from 'src/prisma/user-role';
import { PostService } from 'src/post/post.service';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  async getProfileByUserName(userName: string): Promise<ProfileDto | null> {
    const user = await this.prisma.user.findFirst({
      where: { username: userName },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        crewMemberships: {
          include: {
            crew: {
              include: {
                owner: {
                  select: { id: true, username: true, avatarUrl: true },
                },
                _count: { select: { members: true } },
                crewTabs: {
                  where: { hashtag: { not: null } },
                  select: { hashtag: true },
                },
                events: {
                  where: { date: { gte: new Date() } },
                  orderBy: { date: 'asc' },
                  take: 1,
                  select: { title: true, date: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const postResult = await this.postService.getPosts({
      take: '10',
      authorId: user.id,
    });
    const posts = {
      posts: postResult.posts,
      pageInfo: {
        ...postResult.pageInfo,
        nextCursor: postResult.pageInfo.nextCursor ?? undefined,
      },
    };

    const crews = user.crewMemberships.map((m) => ({
      id: m.crew.id,
      name: m.crew.name,
      avatarUrl: m.crew.avatarUrl ?? undefined,
      profileImage: undefined,
      coverImage: undefined,
      memberCount: m.crew._count.members,
      description: m.crew.description ?? undefined,
      tags: m.crew.crewTabs.map((t) => t.hashtag as string).filter(Boolean),
      links: [{ title: '', url: '' }], //타입에러로 임시값 반환
      owner: {
        id: m.crew.owner.id,
        username: m.crew.owner.username,
        avatarUrl: m.crew.owner.avatarUrl ?? undefined,
      },
      members: undefined,
      upcomingEvent: m.crew.events[0]
        ? {
            title: m.crew.events[0].title,
            date: m.crew.events[0].date.toISOString(),
          }
        : undefined,
    }));

    return {
      id: user.id,
      username: user.username,
      bio: user.bio ?? '',
      imageUrl: user.avatarUrl ?? '',
      tags: [],
      posts,
      crews,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async updateStatus(userId: string, status: UserStatus) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  async requestBrandRole(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.INACTIVE },
    });
  }

  async approveBrandRole(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.BRAND, status: UserStatus.ACTIVE },
    });
  }

  async getFollower(userId: string) {
    return this.prisma.user.findMany({
      where: { following: { some: { followingId: userId } } },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
      },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.user.findMany({
      where: { followers: { some: { followerId: userId } } },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
      },
    });
  }
}

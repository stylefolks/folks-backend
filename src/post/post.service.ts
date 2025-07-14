import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { PostType } from 'src/prisma/post-type';
import { PostVisibility } from 'src/prisma/post-visibility';
import { GetPostsDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserRole } from 'src/prisma/user-role';
import { CrewMemberRole } from 'src/prisma/crew-member-role';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  extractMentions(content: Prisma.JsonValue | null): string[] {
    if (!content || typeof content !== 'object') return [];
    const text = JSON.stringify(content);
    const regex = /@([A-Za-z0-9_-]+)/g;
    const mentions = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text))) {
      mentions.add(match[1]);
    }
    return Array.from(mentions);
  }

  async createPost(dto: CreatePostDto, userId: string) {
    const { title, content, isDraft, tagNames, crewId } = dto;

    if (!Object.values(PostType).includes(dto.type)) {
      //알 수 없는 이유로 $Enum.PostType이 계속 일반 변수에도 할당되지 않으므로 타입 가드 추가
      throw new Error('Invalid post type');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const type = dto.type;

    if (type === PostType.COLUMN) {
      if (!crewId) {
        throw new HttpException(
          'crewId required for columns',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.role === UserRole.USER) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      if (user.role !== UserRole.BRAND) {
        const crew = await this.prisma.crew.findUnique({
          where: { id: crewId },
        });
        if (!crew) {
          throw new HttpException('Crew not found', HttpStatus.NOT_FOUND);
        }

        if (crew.ownerId !== userId) {
          const member = await this.prisma.crewMember.findUnique({
            where: { crewId_userId: { crewId, userId } },
          });

          if (
            !member ||
            (member.role !== CrewMemberRole.OWNER &&
              member.role !== CrewMemberRole.MANAGER)
          ) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
          }
        }
      }
    }

    return this.prisma.post.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type,
        title,
        content,
        isDraft,
        authorId: userId,
        ...(crewId && { crewId }),
        ...(tagNames &&
          tagNames.length > 0 && {
            postTags: {
              create: tagNames.map((tagName) => ({
                hashtags: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              })),
            },
          }),
      },
      include: {
        hashtags: {
          include: {
            hashtags: true,
          },
        },
      },
    });
  }

  async getPosts(dto: GetPostsDto) {
    const { take = '10', cursor, tags, crewId, mention, query, postType } = dto;
    const takeNum = parseInt(take, 10);

    const where: Prisma.PostWhereInput = {
      isDraft: false,
      ...(postType && { type: postType }),
      ...(tags &&
        tags?.length > 0 && {
          hashtags: {
            some: {
              hashtags: { name: { in: tags } },
            },
          },
        }),
      ...(crewId && { crewId }),
      ...(query && {
        title: { contains: query, mode: Prisma.QueryMode.insensitive },
      }),
      ...(mention && {
        crewMentions: {
          some: {
            crewId: mention,
          },
        },
      }),
    };

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: takeNum + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        hashtags: true,
        author: { select: { id: true, username: true } },
        crewMentions: { include: { crew: true } }, // crewMentions를 객체로 명시
      },
    });

    const totalCount = await this.prisma.post.count({ where });
    const hasNextPage = posts.length > takeNum;
    const nextCursor = hasNextPage ? posts[takeNum].id : null;

    return {
      posts: posts.slice(0, takeNum),
      pageInfo: {
        totalCount,
        hasNextPage,
        nextCursor,
      },
    };
  }

  async getPostById(postId: string) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        hashtags: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async updatePost(postId: string, dto: UpdatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post || post.authorId !== userId) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    if (dto.type && !Object.values(PostType).includes(dto.type)) {
      throw new Error('Invalid post type');
    }

    const { ...rest } = dto;
    const data = { ...rest };

    return this.prisma.post.update({
      where: { id: postId },
      data,
      include: { hashtags: true },
    });
  }

  async updatePostVisibility(
    postId: string,
    visibility: PostVisibility,
    userId: string,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post || post.authorId !== userId) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { visibility },
    });
  }

  async parseMentions(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { content: true },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return { mentions: this.extractMentions(post.content) };
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post || post.authorId !== userId) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.post.delete({ where: { id: postId } });
  }
}

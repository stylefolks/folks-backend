/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostType } from '@prisma/client';
import { GetPostsDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  makeTags(tagNames?: string[]) {
    return (
      tagNames?.map((name) => ({
        where: { name },
        create: { name },
      })) || []
    );
  }

  async createPost(dto: CreatePostDto, userId: string) {
    const { title, content, isDraft, tagNames } = dto;

    if (!Object.values(PostType).includes(dto.type)) {
      //알 수 없는 이유로 $Enum.PostType이 계속 일반 변수에도 할당되지 않으므로 타입 가드 추가
      throw new Error('Invalid post type');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const type = dto.type;

    return this.prisma.post.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type,
        title,
        content,
        isDraft,
        authorId: userId,
        tags: {
          connectOrCreate: this.makeTags(tagNames),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async getPosts(dto: GetPostsDto) {
    const { take = '10', cursor, tags } = dto;
    const postType = dto.postType;
    const takeNum = parseInt(take, 10);

    const where: any = {
      isDraft: false,
    };

    if (postType) {
      where.type = postType;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          name: {
            in: tags,
          },
        },
      };
    }

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: takeNum + 1, // +1 to check for next page
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
      include: {
        tags: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
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
        tags: true,
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

    const { tagNames, ...rest } = dto;
    const data: any = { ...rest };

    if (tagNames) {
      data.tags = {
        set: [],
        connectOrCreate: this.makeTags(tagNames),
      };
    }

    return this.prisma.post.update({
      where: { id: postId },
      data,
      include: { tags: true },
    });
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post || post.authorId !== userId) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.post.delete({ where: { id: postId } });
  }
}

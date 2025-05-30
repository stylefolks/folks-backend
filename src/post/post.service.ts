import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostType } from '@prisma/client';

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

  parsingContent(content: string) {
    let parsedContent: string;

    try {
      parsedContent = JSON.parse(content) as string;
    } catch {
      throw new Error('@Format Error while parsing post content');
    }

    return parsedContent;
  }

  async createPost(dto: CreatePostDto, userId: string) {
    const { title, content, isDraft, tagNames } = dto;

    if (!Object.values(PostType).includes(dto.type)) {
      //알 수 없는 이유로 $Enum.PostType이 계속 일반 변수에도 할당되지 않으므로 타입 가드 추가
      throw new Error('Invalid post type');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const type = dto.type;
    const parsedContent = this.parsingContent(content);

    return this.prisma.post.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type,
        title,
        content: parsedContent,
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
}

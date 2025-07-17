import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostDetailCommentDto } from 'src/post/dto/post-detail-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  createComment(dto: CreateCommentDto, userId: string) {
    const { postId, content, parentId } = dto;
    return this.prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
        ...(parentId && { parentCommentId: parentId }),
      },
    });
  }

  getCommentsByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, parentCommentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, username: true } },
      },
    });
  }

  async updateComment(
    id: string,
    dto: UpdateCommentDto,
    userId: string,
  ): Promise<PostDetailCommentDto> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== userId) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { id: true, username: true },
        },
      },
    });

    return { ...updated, createdAt: updated.createdAt.toISOString() };
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== userId) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.comment.delete({ where: { id } });
  }
}

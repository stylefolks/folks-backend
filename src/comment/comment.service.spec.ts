import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';

const mockPrisma = {
  comment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CommentService 서비스', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('댓글을 생성할 수 있다', async () => {
    mockPrisma.comment.create.mockResolvedValue({ id: '1', content: 'hi' });
    const dto = { postId: 'p1', content: 'hi' } as any;
    const result = await service.createComment(dto, 'u1');

    expect(mockPrisma.comment.create).toHaveBeenCalledWith({
      data: { content: 'hi', authorId: 'u1', postId: 'p1' },
    });
    expect(result.id).toBe('1');
  });

  it('작성자가 댓글을 수정할 수 있다', async () => {
    mockPrisma.comment.findUnique.mockResolvedValue({
      id: '1',
      authorId: 'u1',
    });
    mockPrisma.comment.update.mockResolvedValue({
      id: '1',
      content: 'new',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      author: { id: 'u1', username: 'test' },
    });

    const dto: UpdateCommentDto = { content: 'new' };
    const result = await service.updateComment('1', dto, 'u1');

    expect(mockPrisma.comment.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: dto,
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: { select: { id: true, username: true } },
      },
    });
    expect(result).toEqual({
      id: '1',
      content: 'new',
      createdAt: '2024-01-01T00:00:00.000Z',
      author: { id: 'u1', username: 'test' },
    });
  });

  it('작성자가 아닌 경우 수정 시 예외 발생', async () => {
    mockPrisma.comment.findUnique.mockResolvedValue({
      id: '1',
      authorId: 'u1',
    });

    await expect(
      service.updateComment('1', { content: 'x' }, 'u2'),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('댓글을 삭제할 수 있다', async () => {
    mockPrisma.comment.findUnique.mockResolvedValue({
      id: '1',
      authorId: 'u1',
    });
    mockPrisma.comment.delete.mockResolvedValue({});

    await service.deleteComment('1', 'u1');

    expect(mockPrisma.comment.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('존재하지 않는 댓글 삭제 시 예외 발생', async () => {
    mockPrisma.comment.findUnique.mockResolvedValue(null);
    await expect(service.deleteComment('1', 'u1')).rejects.toBeInstanceOf(
      HttpException,
    );
  });
});

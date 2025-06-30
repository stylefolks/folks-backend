import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostVisibility } from 'src/prisma/post-visibility';
import { PostType } from 'src/prisma/post-type';

const mockPrismaService = {
  post: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  },
  user: { findUnique: jest.fn() },
  crew: { findUnique: jest.fn() },
  crewMember: { findUnique: jest.fn() },
};

describe('PostService 서비스', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('작성자가 게시글을 업데이트할 수 있다', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue({
      id: '1',
      authorId: 'user1',
    });
    mockPrismaService.post.update.mockResolvedValue({
      id: '1',
      title: 'new title',
    });

    const dto: UpdatePostDto = { title: 'new title' };
    const result = await service.updatePost('1', dto, 'user1');

    expect(mockPrismaService.post.update).toHaveBeenCalled();
    expect(result.title).toBe('new title');
  });

  it('존재하지 않는 게시글 업데이트 시 예외 발생', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue(null);

    await expect(
      service.updatePost('1', { title: 'x' }, 'user1'),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('작성자가 게시글을 삭제할 수 있다', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue({
      id: '1',
      authorId: 'user1',
    });
    mockPrismaService.post.delete.mockResolvedValue({});

    await service.deletePost('1', 'user1');

    expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('존재하지 않는 게시글 삭제 시 예외 발생', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue(null);

    await expect(service.deletePost('1', 'user1')).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it('작성자가 게시글 공개 범위를 수정할 수 있다', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue({
      id: '1',
      authorId: 'user1',
    });
    mockPrismaService.post.update.mockResolvedValue({
      id: '1',
      visibility: PostVisibility.CREW_ONLY,
    });

    const result = await service.updatePostVisibility(
      '1',
      PostVisibility.CREW_ONLY,
      'user1',
    );

    expect(mockPrismaService.post.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { visibility: PostVisibility.CREW_ONLY },
    });
    expect(result.visibility).toBe(PostVisibility.CREW_ONLY);
  });

  it('COLUMN 타입 게시글은 crewId 없으면 생성 불가', async () => {
    const dto: any = {
      type: PostType.COLUMN,
      title: 't',
      content: {},
    };

    await expect(service.createPost(dto, 'u1')).rejects.toBeInstanceOf(
      HttpException,
    );
  });
});

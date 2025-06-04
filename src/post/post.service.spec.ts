import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';

const mockPrismaService = {
  post: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('PostService 서비스', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('작성자가 게시글을 업데이트할 수 있다', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue({ id: '1', authorId: 'user1' });
    mockPrismaService.post.update.mockResolvedValue({ id: '1', title: 'new title' });

    const dto: UpdatePostDto = { title: 'new title' };
    const result = await service.updatePost('1', dto, 'user1');

    expect(mockPrismaService.post.update).toHaveBeenCalled();
    expect(result.title).toBe('new title');
  });

  it('존재하지 않는 게시글 업데이트 시 예외 발생', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue(null);

    await expect(service.updatePost('1', { title: 'x' }, 'user1')).rejects.toBeInstanceOf(HttpException);
  });

  it('작성자가 게시글을 삭제할 수 있다', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue({ id: '1', authorId: 'user1' });
    mockPrismaService.post.delete.mockResolvedValue({});

    await service.deletePost('1', 'user1');

    expect(mockPrismaService.post.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('존재하지 않는 게시글 삭제 시 예외 발생', async () => {
    mockPrismaService.post.findUnique.mockResolvedValue(null);

    await expect(service.deletePost('1', 'user1')).rejects.toBeInstanceOf(HttpException);
  });
});

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
    findMany: jest.fn(),
    count: jest.fn(),
  },
  user: { findUnique: jest.fn() },
  crew: { findUnique: jest.fn() },
  crewMember: { findUnique: jest.fn() },
  comment: { findMany: jest.fn() },
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

  it('일반 유저는 COLUMN 게시글 작성 불가', async () => {
    const dto: any = {
      type: PostType.COLUMN,
      title: 't',
      content: {},
      crewId: 'c1',
    };

    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'u1',
      role: 'USER',
    });
    mockPrismaService.crew.findUnique.mockResolvedValue({
      id: 'c1',
      ownerId: 'u1',
    });

    await expect(service.createPost(dto, 'u1')).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  describe('getPosts', () => {
    it('페이지네이션이 정상적으로 동작해야 한다', async () => {
      jest.spyOn(mockPrismaService.post, 'findMany').mockResolvedValue([
        {
          id: '1',
          title: '테스트 게시글',
          isDraft: false,
          tags: [],
          author: { id: 'user1', username: 'tester' },
          crewMentions: [],
          createdAt: new Date(),
        },
      ]);
      jest.spyOn(mockPrismaService.post, 'count').mockResolvedValue(1);

      const dto = { take: '1' };
      const result = await service.getPosts(dto);

      expect(result.posts.length).toBe(1);
      expect(result.pageInfo.totalCount).toBe(1);
      expect(result.pageInfo.hasNextPage).toBe(false);
      expect(result.posts[0].title).toBe('테스트 게시글');
    });

    it('crewId로 필터링된 게시글만 반환해야 한다', async () => {
      const dto = { take: '1', crewId: 'crew1' };
      jest.spyOn(mockPrismaService.post, 'findMany').mockResolvedValue([
        {
          id: '2',
          crewId: 'crew1',
          title: '크루 게시글',
          tags: [],
          author: {},
          crew: { id: 'crew1', name: 'c1' },
          crewMentions: [],
          createdAt: new Date(),
        },
      ]);
      jest.spyOn(mockPrismaService.post, 'count').mockResolvedValue(1);

      const result = await service.getPosts(dto);
      expect(result.posts[0].crew?.[0].id).toBe('crew1');
    });

    it('tags, mention, query 등 다양한 조건으로 필터링이 가능해야 한다', async () => {
      const dto = {
        take: '1',
        tags: ['밥', '고기'],
        mention: 'crew2',
        query: '타이틀',
      };

      jest.spyOn(mockPrismaService.post, 'findMany').mockResolvedValue([
        {
          id: '3',
          title: '타이틀이름',
          tags: [{ name: '밥' }, { name: '고기' }],
          crewMentions: [{ crew: { id: 'crew2', name: 'c2' } }],
          author: {},
          isDraft: false,
          createdAt: new Date(),
        },
      ]);
      jest.spyOn(mockPrismaService.post, 'count').mockResolvedValue(1);

      const result = await service.getPosts(dto);
      expect(result.posts[0].title).toContain('타이틀');
      expect(result.posts[0].crew?.[0].id).toBe('crew2');
    });
  });

  describe('getPostComments', () => {
    it('게시글의 댓글을 조회할 수 있다', async () => {
      const now = new Date();
      mockPrismaService.comment.findMany.mockResolvedValue([
        {
          id: 'c1',
          content: 'hello',
          createdAt: now,
          author: { id: 'u1', username: 'tester', email: 'e' },
        },
      ]);

      const result = await service.getPostComments('p1');

      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 'p1', parentCommentId: null },
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              email: true,
              bio: true,
              role: true,
            },
          },
        },
      });

      expect(result[0].id).toBe('c1');
      expect(result[0].createdAt).toBe(now.toISOString());
      expect(result[0].content).toBe('hello');
      expect(result[0].author.username).toBe('tester');
    });
  });
});

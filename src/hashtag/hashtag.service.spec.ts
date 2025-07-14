import { Test, TestingModule } from '@nestjs/testing';
import { HashtagService } from './hashtag.service';
import { PrismaService } from 'src/prisma/prisma.service';

const mockPrisma = {
  hashTag: { findMany: jest.fn() },
};

describe('HashtagService', () => {
  let service: HashtagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashtagService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<HashtagService>(HashtagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls prisma with default take', async () => {
    mockPrisma.hashTag.findMany.mockResolvedValue([{ name: '#hot' }]);

    const result = await service.getHot();

    expect(mockPrisma.hashTag.findMany).toHaveBeenCalledWith({
      orderBy: { postTags: { _count: 'desc' } },
      take: 10,
      include: { _count: { select: { postTags: true } } },
    });
    expect(result[0].name).toBe('#hot');
  });

  it('supports custom take value', async () => {
    mockPrisma.hashTag.findMany.mockResolvedValue([]);

    await service.getHot(5);

    expect(mockPrisma.hashTag.findMany).toHaveBeenCalledWith({
      orderBy: { postTags: { _count: 'desc' } },
      take: 5,
      include: { _count: { select: { postTags: true } } },
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  user: {
    update: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updateUser calls prisma update with dto', async () => {
    mockPrismaService.user.update.mockResolvedValue({ id: '1', username: 'new' });
    const dto = { username: 'new', bio: 'hi', imageUrl: 'img' };

    const result = await service.updateUser('1', dto as any);

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: dto,
    });
    expect(result.id).toBe('1');
  });
});

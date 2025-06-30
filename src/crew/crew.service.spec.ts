import { Test, TestingModule } from '@nestjs/testing';
import { CrewService } from './crew.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { HttpException } from '@nestjs/common';

const mockPrismaService = {
  crew: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('CrewService', () => {
  let service: CrewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrewService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CrewService>(CrewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create calls prisma with correct data', async () => {
    const dto: CreateCrewDto = { name: 'crew', description: 'desc' };
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'owner1',
      role: 'INFLUENCER',
    });
    mockPrismaService.crew.findFirst.mockResolvedValue(null);
    mockPrismaService.crew.create.mockResolvedValue({ id: '1', ...dto });

    const result = await service.create(dto, 'owner1');

    expect(mockPrismaService.crew.create).toHaveBeenCalledWith({
      data: {
        name: 'crew',
        description: 'desc',
        coverImage: undefined,
        links: undefined,
        ownerId: 'owner1',
      },
    });
    expect(result.id).toBe('1');
  });

  it('findOne retrieves crew with owner', async () => {
    mockPrismaService.crew.findUnique.mockResolvedValue({ id: '1' });

    const result = await service.findOne('1');

    expect(mockPrismaService.crew.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: {
        owner: {
          select: { id: true, username: true },
        },
      },
    });
    expect(result).toEqual({ id: '1' });
  });

  it('updates crew when owner', async () => {
    mockPrismaService.crew.findUnique.mockResolvedValue({ id: '1', ownerId: 'o1' });
    mockPrismaService.crew.update.mockResolvedValue({ id: '1', name: 'new' });

    const result = await service.update('1', { name: 'new' }, 'o1');

    expect(mockPrismaService.crew.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { name: 'new' },
    });
    expect(result.name).toBe('new');
  });

  it('throws when non-owner updates crew', async () => {
    mockPrismaService.crew.findUnique.mockResolvedValue({ id: '1', ownerId: 'o1' });

    await expect(service.update('1', { name: 'x' }, 'o2')).rejects.toBeInstanceOf(HttpException);
  });

  it('throws when creator role is not influencer', async () => {
    const dto: CreateCrewDto = { name: 'crew' } as any;
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 'u1', role: 'USER' });

    await expect(service.create(dto, 'u1')).rejects.toBeInstanceOf(HttpException);
  });

  it('throws when user already has a crew', async () => {
    const dto: CreateCrewDto = { name: 'crew' } as any;
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 'u1', role: 'INFLUENCER' });
    mockPrismaService.crew.findFirst.mockResolvedValue({ id: 'c1' });

    await expect(service.create(dto, 'u1')).rejects.toBeInstanceOf(HttpException);
  });

  it('deletes crew when owner', async () => {
    mockPrismaService.crew.findUnique.mockResolvedValue({ id: '1', ownerId: 'o1' });
    mockPrismaService.crew.delete.mockResolvedValue({});

    await service.delete('1', 'o1');

    expect(mockPrismaService.crew.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('throws when deleting non-existent crew', async () => {
    mockPrismaService.crew.findUnique.mockResolvedValue(null);

    await expect(service.delete('1', 'o1')).rejects.toBeInstanceOf(HttpException);
  });
});

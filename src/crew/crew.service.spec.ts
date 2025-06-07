import { Test, TestingModule } from '@nestjs/testing';
import { CrewService } from './crew.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';

const mockPrismaService = {
  crew: {
    create: jest.fn(),
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
});

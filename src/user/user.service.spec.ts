import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from 'src/prisma/user-status';
import { UserRole } from 'src/prisma/user-role';

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

  it('updateStatus updates user status', async () => {
    mockPrismaService.user.update.mockResolvedValue({ id: '1', status: UserStatus.BANNED });

    const result = await service.updateStatus('1', UserStatus.BANNED);

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: UserStatus.BANNED },
    });
    expect(result.status).toBe(UserStatus.BANNED);
  });

  it('requestBrandRole sets status inactive', async () => {
    mockPrismaService.user.update.mockResolvedValue({ id: '1', status: UserStatus.INACTIVE });

    const result = await service.requestBrandRole('1');

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: UserStatus.INACTIVE },
    });
    expect(result.status).toBe(UserStatus.INACTIVE);
  });

  it('approveBrandRole sets role brand and active', async () => {
    mockPrismaService.user.update.mockResolvedValue({ id: '1', role: UserRole.BRAND, status: UserStatus.ACTIVE });

    const result = await service.approveBrandRole('1');

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { role: UserRole.BRAND, status: UserStatus.ACTIVE },
    });
    expect(result.role).toBe(UserRole.BRAND);
  });
});

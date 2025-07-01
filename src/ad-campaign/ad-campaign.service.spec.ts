import { Test, TestingModule } from '@nestjs/testing';
import { AdCampaignService } from './ad-campaign.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'src/prisma/user-role';
import { AdCampaignStatus } from 'src/prisma/ad-campaign-status';

const mockPrisma = {
  adCampaign: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('AdCampaignService', () => {
  let service: AdCampaignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdCampaignService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdCampaignService>(AdCampaignService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows brand users to create campaign', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'b1', role: UserRole.BRAND });
    mockPrisma.adCampaign.create.mockResolvedValue({ id: 'c1' });

    const dto: any = { crewId: 'crew', content: 'ad', bannerUrl: 'url', budget: 1, startsAt: new Date().toISOString(), endsAt: new Date().toISOString() };
    const result = await service.create(dto, 'b1');

    expect(mockPrisma.adCampaign.create).toHaveBeenCalled();
    expect(result.id).toBe('c1');
  });

  it('rejects non-brand user creation', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', role: UserRole.USER });
    const dto: any = { crewId: 'c', content: 'ad', bannerUrl: 'b', budget: 1, startsAt: '', endsAt: '' };
    await expect(service.create(dto, 'u1')).rejects.toBeDefined();
  });

  it('validates status transitions', async () => {
    mockPrisma.adCampaign.findUnique.mockResolvedValue({ id: 'c1', status: AdCampaignStatus.PENDING });
    mockPrisma.adCampaign.update.mockResolvedValue({ id: 'c1', status: AdCampaignStatus.APPROVED });

    const result = await service.updateStatus('c1', AdCampaignStatus.APPROVED);
    expect(mockPrisma.adCampaign.update).toHaveBeenCalledWith({ where: { id: 'c1' }, data: { status: AdCampaignStatus.APPROVED } });
    expect(result.status).toBe(AdCampaignStatus.APPROVED);
  });
});

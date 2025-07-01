import { Test, TestingModule } from '@nestjs/testing';
import { AdCampaignController } from './ad-campaign.controller';
import { AdCampaignService } from './ad-campaign.service';
import { AdCampaignStatus } from 'src/prisma/ad-campaign-status';

const mockService = {
  create: jest.fn(),
  updateStatus: jest.fn(),
};

describe('AdCampaignController', () => {
  let controller: AdCampaignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdCampaignController],
      providers: [{ provide: AdCampaignService, useValue: mockService }],
    }).compile();

    controller = module.get<AdCampaignController>(AdCampaignController);
  });

  afterEach(() => jest.clearAllMocks());

  it('calls service on create', async () => {
    mockService.create.mockResolvedValue({ id: 'c1' });
    const dto: any = {};
    const req: any = { user: { id: 'b1' } };
    const result = await controller.create(dto, req);
    expect(mockService.create).toHaveBeenCalledWith(dto, 'b1');
    expect(result.id).toBe('c1');
  });

  it('calls service on status update', async () => {
    mockService.updateStatus.mockResolvedValue({ id: 'c1', status: AdCampaignStatus.APPROVED });
    const dto: any = { status: AdCampaignStatus.APPROVED };
    const result = await controller.updateStatus('c1', dto);
    expect(mockService.updateStatus).toHaveBeenCalledWith('c1', AdCampaignStatus.APPROVED);
    expect(result.status).toBe(AdCampaignStatus.APPROVED);
  });
});

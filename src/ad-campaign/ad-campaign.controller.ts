import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { AdCampaignService } from './ad-campaign.service';
import { CreateAdCampaignDto } from './dto/create-ad-campaign.dto';
import { UpdateAdCampaignStatusDto } from './dto/update-ad-campaign-status.dto';

@Controller('ad-campaigns')
export class AdCampaignController {
  constructor(private readonly adCampaignService: AdCampaignService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAdCampaignDto, @Req() req: RequestWithUser) {
    return this.adCampaignService.create(dto, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdCampaignStatusDto,
  ) {
    return this.adCampaignService.updateStatus(id, dto.status);
  }
}

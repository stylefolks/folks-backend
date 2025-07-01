import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { ValidateSponsorshipDto } from './dto/validate-sponsorship.dto';
import { CreateSponsorshipDto } from './dto/create-sponsorship.dto';
import { SponsorshipService } from './sponsorship.service';

@Controller('sponsorships')
export class SponsorshipController {
  constructor(private readonly sponsorshipService: SponsorshipService) {}

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  validate(@Body() dto: ValidateSponsorshipDto, @Req() req: RequestWithUser) {
    return this.sponsorshipService.validate(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSponsorshipDto, @Req() req: RequestWithUser) {
    return this.sponsorshipService.create(dto, req.user.id);
  }

  @Post('webhook')
  webhook(@Body() body: unknown) {
    return this.sponsorshipService.handleWebhook(body);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SponsorshipController } from './sponsorship.controller';
import { SponsorshipService } from './sponsorship.service';

@Module({
  imports: [ConfigModule],
  controllers: [SponsorshipController],
  providers: [SponsorshipService],
})
export class SponsorshipModule {}

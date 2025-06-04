import { Module } from '@nestjs/common';
import { CrewService } from './crew.service';
import { CrewController } from './crew.controller';

@Module({
  controllers: [CrewController],
  providers: [CrewService],
})
export class CrewModule {}

import { Module } from '@nestjs/common';
import { CrewTabService } from './crew-tab.service';
import { CrewTabController } from './crew-tab.controller';

@Module({
  controllers: [CrewTabController],
  providers: [CrewTabService],
})
export class CrewTabModule {}

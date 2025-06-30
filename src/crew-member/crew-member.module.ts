import { Module } from '@nestjs/common';
import { CrewModule } from 'src/crew/crew.module';
import { CrewMemberController } from './crew-member.controller';
import { CrewMemberService } from './crew-member.service';

@Module({
  imports: [CrewModule],
  controllers: [CrewMemberController],
  providers: [CrewMemberService],
})
export class CrewMemberModule {}

import { Module } from '@nestjs/common';
import { CrewMemberController } from './crew-member.controller';
import { CrewMemberService } from './crew-member.service';

@Module({
  controllers: [CrewMemberController],
  providers: [CrewMemberService],
})
export class CrewMemberModule {}

import { Module } from '@nestjs/common';
import { CrewPermissionModule } from 'src/crew-permission/crew-permission.module';
import { CrewMemberController } from './crew-member.controller';
import { CrewMemberService } from './crew-member.service';

@Module({
  imports: [CrewPermissionModule],
  controllers: [CrewMemberController],
  providers: [CrewMemberService],
})
export class CrewMemberModule {}

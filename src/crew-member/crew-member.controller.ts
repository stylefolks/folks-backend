import {
  Controller,
  Param,
  Post,
  UseGuards,
  Req,
  Get,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CrewMemberService } from './crew-member.service';

@Controller('crew')
export class CrewMemberController {
  constructor(private readonly service: CrewMemberService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':crewId/join')
  join(
    @Param('crewId') crewId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.service.join(crewId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':crewId/leave')
  leave(@Param('crewId') crewId: string, @Req() req: RequestWithUser) {
    return this.service.leave(crewId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/memberships')
  listMine(@Req() req: RequestWithUser) {
    return this.service.listUserCrews(req.user.id);
  }
}

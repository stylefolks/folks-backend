import {
  Controller,
  Param,
  Post,
  UseGuards,
  Req,
  Get,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CrewMemberService } from './crew-member.service';
import { CrewMemberRole } from 'src/prisma/crew-member-role';

@Controller('crew')
export class CrewMemberController {
  constructor(private readonly service: CrewMemberService) {}

  @Get(':crewId/members')
  list(@Param('crewId') crewId: string) {
    return this.service.listMembers(crewId);
  }

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
  @Patch(':crewId/members/:userId/role')
  updateRole(
    @Param('crewId') crewId: string,
    @Param('userId') userId: string,
    @Body('role') role: CrewMemberRole,
  ) {
    return this.service.updateRole(crewId, userId, role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':crewId/members/:userId')
  remove(
    @Param('crewId') crewId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.removeMember(crewId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/memberships')
  listMine(@Req() req: RequestWithUser) {
    return this.service.listUserCrews(req.user.id);
  }
}

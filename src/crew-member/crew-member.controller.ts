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

@Controller()
export class CrewMemberController {
  constructor(private readonly service: CrewMemberService) {}

  @UseGuards(JwtAuthGuard)
  @Post('crew/:crewId/join')
  join(
    @Param('crewId') crewId: string,
    @Req() req: RequestWithUser,
    @Body('roleId') roleId: number,
  ) {
    return this.service.join(crewId, req.user.id, roleId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('crew/me/memberships')
  listMine(@Req() req: RequestWithUser) {
    return this.service.listUserCrews(req.user.id);
  }

  @Get('crews/:crewId/members')
  list(@Param('crewId') crewId: string) {
    return this.service.listCrewMembers(crewId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('crews/:crewId/members/:userId/role')
  changeRole(
    @Param('crewId') crewId: string,
    @Param('userId') userId: string,
    @Body('role') role: CrewMemberRole,
    @Req() req: RequestWithUser,
  ) {
    return this.service.changeRole(crewId, userId, role, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('crews/:crewId/members/:userId')
  remove(
    @Param('crewId') crewId: string,
    @Param('userId') userId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.service.removeMember(crewId, userId, req.user.id);
  }
}

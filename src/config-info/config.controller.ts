import { Controller, Get } from '@nestjs/common';
import { PostType } from 'src/prisma/post-type';
import { UserRole } from 'src/prisma/user-role';
import { CrewStatus } from 'src/prisma/crew-status';
import { PostVisibility } from 'src/prisma/post-visibility';

@Controller('config')
export class ConfigController {
  @Get('post-types')
  getPostTypes() {
    return Object.values(PostType);
  }

  @Get('user-roles')
  getUserRoles() {
    return Object.values(UserRole);
  }

  @Get('crew-status')
  getCrewStatus() {
    return Object.values(CrewStatus);
  }

  @Get('post-visibility')
  getPostVisibility() {
    return Object.values(PostVisibility);
  }
}

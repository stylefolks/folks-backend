import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ApproveBrandRoleDto } from './dto/approve-brand-role.dto';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/common/types/request-with-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return {
      userId: req.user.id,
      email: req.user.email,
      username: req.user.username,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() updateDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(req.user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/status')
  updateMyStatus(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.userService.updateStatus(req.user.id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-brand-role')
  requestBrandRole(@Req() req: RequestWithUser) {
    return this.userService.requestBrandRole(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('approve-brand-role')
  approveBrandRole(@Body() dto: ApproveBrandRoleDto) {
    return this.userService.approveBrandRole(dto.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req: RequestWithUser) {
    await this.userService.deleteUser(req.user.id);
    return {}; // deleteUser 구현 예정
  }
}

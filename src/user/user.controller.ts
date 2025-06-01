import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/common/types/request-with-user';

@Controller('user')
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
  @Delete('me')
  async deleteMe(@Req() req: RequestWithUser) {
    await this.userService.deleteUser(req.user.id);
    return {}; // deleteUser 구현 예정
  }
}

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
import { RequestWithUser } from 'src/auth/types/request-with-user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return {
      userId: req.user.userId,
      email: req.user.email,
      username: req.user.username,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: RequestWithUser, @Body() updateDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteMe(@Req() req: RequestWithUser) {
    return {}; // deleteUser 구현 예정
  }
}

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RequestWithUser } from './types/request-with-user';
import { MeResponseDto } from './dto/me-response.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: RequestWithUser): MeResponseDto {
    return req.user;
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { email, username, password } = signupDto;

    return this.authService.signup(email, username, password);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return await this.authService.login(email, password);
  }
}

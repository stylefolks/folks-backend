import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { MeResponseDto } from './dto/me-response.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RequestEmailVerificationDto } from './dto/request-email-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = loginDto;
    return await this.authService.login(email, password, res);
  }

  @Post('request-email-verification')
  requestVerification(@Body() dto: RequestEmailVerificationDto) {
    return this.authService.requestEmailVerification(dto.email);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    const { email, code } = dto;
    return this.authService.verifyEmail(email, code);
  }

  @Post('refresh')
  refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken;
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    const result = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return result;
  }
}

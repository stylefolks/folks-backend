import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default_secret_key',
    });
  }

  /**
   * @description
   * 매 요청마다 토큰에서 id 뽑고
   * DB에서 실제 유저 확인하고
   * req.user에 유저 정보 세팅
   * Controller에서는 안전하게 req.user 꺼내서 사용
   * @param payload
   * @returns
   */
  async validate(payload: { sub: string; email: string }) {
    const user = await this.authService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //req.user에 해당 정보 항상 세팅.
    return {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  }
}

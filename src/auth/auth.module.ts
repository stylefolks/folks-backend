import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule import
      inject: [ConfigService], // ConfigService 주입
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret_key'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}

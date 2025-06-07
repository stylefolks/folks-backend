import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException } from '@nestjs/common';

const mockJwt = { sign: jest.fn() };
const mockPrisma = {
  user: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwt },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('로그인 시 비밀번호가 맞으면 토큰을 반환한다', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      id: '1',
      email: 'a',
      password: 'hashed',
    });
    jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true as any);
    mockJwt.sign.mockReturnValue('token');

    const result = await service.login('a', 'pw');

    expect(result).toEqual({ accessToken: 'token' });
  });

  it('존재하지 않는 유저 로그인 시 예외 발생', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    await expect(service.login('a', 'pw')).rejects.toBeInstanceOf(
      HttpException,
    );
  });
});

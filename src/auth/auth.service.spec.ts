/* eslint-disable @typescript-eslint/no-require-imports */
import { UserStatus } from 'src/prisma/user-status';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException } from '@nestjs/common';

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockJwt = { sign: jest.fn() };

const mockJwtService = {
  sign: jest.fn().mockReturnValue('access-token'),
};
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(service.login('test@test.com', 'pw')).rejects.toThrow(
        'Invalid credentials',
      );
    });
    it('should throw if password invalid', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        passwordHash: 'hash',
        status: UserStatus.ACTIVE,
      });
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);
      await expect(service.login('test@test.com', 'pw')).rejects.toThrow(
        'Invalid credentials',
      );
    });
    it('should throw if user not active', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        passwordHash: 'hash',
        status: UserStatus.INACTIVE,
      });
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
      await expect(service.login('test@test.com', 'pw')).rejects.toThrow(
        'Email not verified',
      );
    });
    it('should return tokens if valid', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        username: 'u',
        passwordHash: 'hash',
        status: UserStatus.ACTIVE,
        role: 'USER',
      });
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
      mockPrisma.refreshToken.create.mockResolvedValue({});
      const result = await service.login('test@test.com', 'pw');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user).toMatchObject({
        id: '1',
        email: 'test@test.com',
        username: 'u',
        role: 'USER',
      });
    });
  });

  describe('refresh', () => {
    it('should throw if token not found', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);
      await expect(service.refresh('token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });
    it('should throw if token expired', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() - 1000),
        user: { id: '1', email: 'test@test.com' },
      });
      await expect(service.refresh('token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });
    it('should return accessToken if valid', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() + 1000),
        user: { id: '1', email: 'test@test.com' },
      });
      const result = await service.refresh('token');
      expect(result.accessToken).toBe('access-token');
    });
  });

  describe('logout', () => {
    it('should delete refreshToken', async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({});
      const result = await service.logout('token');
      expect(result.loggedOut).toBe(true);
    });
  });
});

// 중복 describe 제거 및 반환값 구조에 맞게 수정

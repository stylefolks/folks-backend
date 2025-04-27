import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  it('user 계정으로 회원가입이 가능하다.', async () => {
    mockPrismaService.user.create.mockResolvedValueOnce({
      id: 'mock-id',
      email: 'mock@example.com',
      username: 'mockuser',
    });

    const result = await userController.signup(
      'mock@example.com',
      'mockuser',
      'password',
    );

    expect(result.email).toBe('mock@example.com');
    expect(mockPrismaService.user.create).toBeCalledTimes(1);
  });

  it('회원가입된 유저로 로그인이 가능하다.', async () => {
    mockPrismaService.user.findFirst.mockResolvedValueOnce({
      id: 'mock-id',
      email: 'mock@example.com',
      username: 'mockuser',
    });

    const result = await userController.login('mock@example.com', 'password');

    expect(result?.email).toBe('mock@example.com');
    expect(mockPrismaService.user.findFirst).toBeCalledTimes(1);
  });
});

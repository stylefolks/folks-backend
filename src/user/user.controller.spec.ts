import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserStatus } from 'src/prisma/user-status';
import { UserRole } from 'src/prisma/user-role';

const mockUserService = {
  getProfileById: jest.fn(),
  updateUser: jest.fn(),
  updateStatus: jest.fn(),
  requestBrandRole: jest.fn(),
  approveBrandRole: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUser calls service with id', async () => {
    mockUserService.getProfileById.mockResolvedValue({ id: '1' });

    const result = await userController.getUser('1');

    expect(mockUserService.getProfileById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });

  it('updateMe calls service with user id', async () => {
    mockUserService.updateUser.mockResolvedValue({ id: '1' });
    const req: any = { user: { id: '1' } };

    const dto: any = { bio: 'hi' };
    const result = await userController.updateMe(req, dto);

    expect(mockUserService.updateUser).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual({ id: '1' });
  });

  it('updateMyStatus calls service with user id and status', async () => {
    mockUserService.updateStatus.mockResolvedValue({
      id: '1',
      status: UserStatus.BANNED,
    });
    const req: any = { user: { id: '1' } };
    const dto: any = { status: UserStatus.BANNED };
    const result = await userController.updateMyStatus(req, dto);

    expect(mockUserService.updateStatus).toHaveBeenCalledWith(
      '1',
      UserStatus.BANNED,
    );
    expect(result).toEqual({ id: '1', status: UserStatus.BANNED });
  });

  it('requestBrandRole calls service with user id', async () => {
    mockUserService.requestBrandRole.mockResolvedValue({ id: '1' });
    const req: any = { user: { id: '1' } };
    const result = await userController.requestBrandRole(req);

    expect(mockUserService.requestBrandRole).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });

  it('approveBrandRole calls service with dto userId', async () => {
    mockUserService.approveBrandRole.mockResolvedValue({
      id: '2',
      role: UserRole.BRAND,
    });
    const dto: any = { userId: '2' };
    const result = await userController.approveBrandRole(dto);

    expect(mockUserService.approveBrandRole).toHaveBeenCalledWith('2');
    expect(result).toEqual({ id: '2', role: UserRole.BRAND });
  });
});

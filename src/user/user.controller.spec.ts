import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUserService = {
  updateUser: jest.fn(),
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

  it('updateMe calls service with user id', async () => {
    mockUserService.updateUser.mockResolvedValue({ id: '1' });
    const req: any = { user: { id: '1' } };

    const dto: any = { bio: 'hi' };
    const result = await userController.updateMe(req, dto);

    expect(mockUserService.updateUser).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual({ id: '1' });
  });
});

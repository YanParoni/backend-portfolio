import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { AuthService } from '../../src/auth/auth.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { LoginUserDto } from '../../src/auth/dto/login-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  const mockUsersService = {
    create: jest.fn().mockImplementation((dto) => ({
      _id: '1',
      ...dto,
    })),
  };

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ accessToken: 'jwt-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    };

    expect(await controller.register(createUserDto)).toEqual({
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    });

    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should login a user', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    expect(await controller.login(loginUserDto)).toEqual({
      accessToken: 'jwt-token',
    });
    expect(authService.login).toHaveBeenCalledWith(loginUserDto);
  });

  it('should return user profile', () => {
    const req = { user: { username: 'testuser' } };

    expect(controller.getProfile(req)).toEqual(req.user);
  });
});

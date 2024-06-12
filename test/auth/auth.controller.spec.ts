/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User as UserInterface } from '../users/interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateOAuthLogin: jest.fn().mockResolvedValue('jwt-token'),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('signed-jwt'),
  };

  const mockUsersService = {
    findOneByEmail: jest.fn().mockResolvedValue(null),
    createOAuthUser: jest.fn().mockResolvedValue({
      _id: 'user-id',
      username: 'OAuthUser',
      email: 'oauth@example.com',
      password: null,
      favorites: [],
      reviews: [],
      likes: [],
    } as UserInterface),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard('google'))
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return jwt token on google callback', async () => {
    const req = { user: { email: 'test@example.com' } };
    const result = await controller.googleAuthRedirect(req);
    expect(result).toEqual({ jwt: 'jwt-token' });
    expect(mockAuthService.validateOAuthLogin).toHaveBeenCalledWith(req.user);
  });
});

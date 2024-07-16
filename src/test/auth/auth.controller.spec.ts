import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { AuthService } from '@/app/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            changePassword: jest.fn(),
            validateToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if login is successful', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password' };
      (authService.login as jest.Mock).mockResolvedValue({ token: 'token' });

      const result = await authController.login(loginUserDto);

      expect(result).toEqual({ token: 'token' });
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password' };
      (authService.login as jest.Mock).mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(authController.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('changePassword', () => {
    it('should return a success message if password is changed', async () => {
      const req = { user: { sub: '1' } } as AuthenticatedRequest;
      const currentPassword = 'currentPassword';
      const newPassword = 'newPassword';
      (authService.changePassword as jest.Mock).mockResolvedValue({
        message: 'Password changed successfully',
      });

      const result = await authController.changePassword(
        req,
        currentPassword,
        newPassword,
      );

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(authService.changePassword).toHaveBeenCalledWith(
        '1',
        newPassword,
        currentPassword,
      );
    });
  });

  describe('validateToken', () => {
    it('should return valid and decoded token if valid', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ userId: '1' });

      const result = await authController.validateToken('token');

      expect(result).toEqual({ valid: true, decoded: { userId: '1' } });
      expect(jwtService.verify).toHaveBeenCalledWith('token');
    });

    it('should return invalid if token is invalid', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await authController.validateToken('invalidToken');

      expect(result).toEqual({
        valid: false,
        message: 'Invalid or expired token',
      });
      expect(jwtService.verify).toHaveBeenCalledWith('invalidToken');
    });
  });
});

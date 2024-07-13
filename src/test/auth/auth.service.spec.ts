import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/app/services/auth.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@/app/services/email.service';
import { User } from '@/domain/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            createOAuthUser: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        oauth: false,
      } as User;
      const loginUserDto = { email: 'test@example.com', password: 'password' };
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('token');

      const result = await authService.login(loginUserDto);

      expect(result).toEqual({ token: 'token' });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password' };
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should send a password reset email if user exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      } as User;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue('token');
      jest.spyOn(emailService, 'sendMail').mockResolvedValue(null);

      await authService.requestPasswordReset('test@example.com');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(jwtService.sign).toHaveBeenCalled();
      expect(emailService.sendMail).toHaveBeenCalledWith(
        'test@example.com',
        'testuser',
        expect.any(String),
      );
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.requestPasswordReset('test@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset the password if token is valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com' } as User;
      (jwtService.verify as jest.Mock).mockReturnValue({ userId: '1' });
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'updatePassword').mockResolvedValue(null);

      await authService.resetPassword('validToken', 'newPassword');

      expect(jwtService.verify).toHaveBeenCalledWith('validToken');
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        '1',
        'hashedPassword',
      );
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ userId: '1' });
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(
        authService.resetPassword('validToken', 'newPassword'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    it('should change the password for non-OAuth user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        oauth: false,
      } as User;
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      jest.spyOn(userRepository, 'updatePassword').mockResolvedValue(null);

      const result = await authService.changePassword(
        '1',
        'newPassword',
        'currentPassword',
      );

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'currentPassword',
        'hashedPassword',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        '1',
        'newHashedPassword',
      );
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it('should change the password for OAuth user without current password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: '',
        oauth: true,
      } as User;
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      jest.spyOn(userRepository, 'updatePassword').mockResolvedValue(null);

      const result = await authService.changePassword('1', 'newPassword');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        '1',
        'newHashedPassword',
      );
      expect(result).toEqual({
        message: 'Password set successfully for OAuth user',
      });
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        oauth: false,
      } as User;
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword('1', 'newPassword', 'currentPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(
        authService.changePassword('1', 'newPassword', 'currentPassword'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

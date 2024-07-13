import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/presentation/controllers/user.controller';
import { UserService } from '@/app/services/user.service';
import { NotFoundException } from '@nestjs/common';
import { BlockedGuard } from '@/infra/guards/blocked.guard';
import { Reflector } from '@nestjs/core';
import { UserRepository } from '@/infra/repositories/user.repository';
import { S3Service } from '@/app/services/s3.service';
import { createMockUser } from '../utils/mock-user';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
            getBucketName: jest.fn(),
          },
        },
        BlockedGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const mockUser = createMockUser({
        email: 'test@example.com',
        username: 'testuser',
      });
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      const result = await userController.register(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getProfile', () => {
    it('should return user if found', async () => {
      const mockUser = createMockUser();
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);

      const result = await userController.getProfile(
        { user: { sub: '1' } } as any,
        '1',
      );

      expect(result).toEqual(mockUser);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        userController.getProfile({ user: { sub: '1' } } as any, '1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

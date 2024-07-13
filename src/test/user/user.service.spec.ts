import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/app/services/user.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { S3Service } from '@/app/services/s3.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '@/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateProfileImage: jest.fn(),
            updateHeaderImage: jest.fn(),
            updateBio: jest.fn(),
            updateAt: jest.fn(),
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
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    s3Service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const mockUser = new User(
        '1',
        'testuser',
        'testuser',
        'test@example.com',
        await bcrypt.hash('password', 10),
        '',
        '',
        '',
        false,
        [],
        [],
        [],
        [],
        [],
        [],
        false,
      );

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw ConflictException if email is already in use', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const mockUser = new User(
        '1',
        'testuser',
        'testuser',
        'test@example.com',
        'hashedPassword',
        '',
        '',
        '',
        false,
        [],
        [],
        [],
        [],
        [],
        [],
        false,
      );

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);

      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findById', () => {
    it('should return the user if found', async () => {
      const mockUser = new User(
        '1',
        'testuser',
        'testuser',
        'test@example.com',
        'hashedPassword',
        '',
        '',
        '',
        false,
        [],
        [],
        [],
        [],
        [],
        [],
        false,
      );

      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

      const result = await userService.findById('1');

      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(userService.findById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
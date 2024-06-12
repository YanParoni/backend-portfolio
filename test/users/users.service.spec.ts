import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    _id: 'someId',
    favorites: [],
    reviews: [],
    likes: [],
  };

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test',
    };
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('hashedPassword'));
    const user = await service.create(userDto);
    expect(user).toEqual(mockUser);
    expect(mockUserModel.create).toHaveBeenCalledWith({
      ...userDto,
      password: 'hashedPassword',
    });
  });

  it('should find a user by email', async () => {
    const user = await service.findOneByEmail('test@example.com');
    expect(user).toEqual(mockUser);
  });
  it('should create a user directly using the model', async () => {
    const userDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test',
    };
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('hashedPassword'));
    const createdUser = new model({
      ...userDto,
      password: await bcrypt.hash(userDto.password, 10),
    });
    await createdUser.save();
    expect(mockUserModel.create).toHaveBeenCalled();
  });

  it('should create an OAuth user', async () => {
    const profile = {
      firstName: 'OAuthUser',
      email: 'oauth@example.com',
    };

    const createdUser = {
      ...mockUser,
      username: profile.firstName,
      email: profile.email,
      password: null,
    };

    mockUserModel.create.mockReturnValueOnce(createdUser);
    const user = await service.createOAuthUser(profile);
    expect(user).toEqual({
      ...createdUser,
      _id: createdUser._id.toString(),
      password: null,
    });
    expect(mockUserModel.create).toHaveBeenCalledWith({
      username: profile.firstName,
      email: profile.email,
      password: null,
      favorites: [],
      reviews: [],
      likes: [],
    });
    expect(mockUserModel.create).toHaveBeenCalled();
  });
});

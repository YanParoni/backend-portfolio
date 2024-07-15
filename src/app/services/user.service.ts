import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '@/infra/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/app/dto/create-user.dto';
import { S3Service } from '@/app/services/s3.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new User(
      null,
      createUserDto.username,
      createUserDto.at,
      createUserDto.email,
      hashedPassword,
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
    return this.userRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  private async convertBase64ToFile(
    base64String: string,
    filename: string,
  ): Promise<Express.Multer.File> {
    const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const buffer = Buffer.from(matches[2], 'base64');
    return {
      fieldname: 'file',
      originalname: filename,
      encoding: '7bit',
      mimetype: matches[1],
      size: buffer.length,
      buffer,
    } as Express.Multer.File;
  }

  async updateProfileImage(userId: string, base64Image: string): Promise<void> {
    const user = await this.findById(userId);

    if (user.profileImage && this.isS3Url(user.profileImage)) {
      await this.s3Service.deleteFile(user.profileImage);
    }

    const file = await this.convertBase64ToFile(
      base64Image,
      'profile-image.jpg',
    );
    const newImageUrl = await this.s3Service.uploadFile(file);
    user.updateProfileImage(newImageUrl);
    await this.userRepository.updateProfileImage(userId, newImageUrl);
  }

  async updateHeaderImage(userId: string, base64Image: string): Promise<void> {
    const user = await this.findById(userId);

    if (user.headerImage && this.isS3Url(user.headerImage)) {
      await this.s3Service.deleteFile(user.headerImage);
    }

    const file = await this.convertBase64ToFile(
      base64Image,
      'header-image.jpg',
    );
    const newImageUrl = await this.s3Service.uploadFile(file);

    user.updateHeaderImage(newImageUrl);
    await this.userRepository.updateHeaderImage(userId, newImageUrl);
  }

  async updateBio(userId: string, newBio: string): Promise<void> {
    await this.userRepository.updateBio(userId, newBio);
  }

  async updateAt(userId: string, newAt: string): Promise<void> {
    await this.userRepository.updateAt(userId, newAt);
  }

  async addGameInteraction(
    userId: string,
    interactionId: string,
  ): Promise<void> {
    await this.userRepository.addGameInteraction(userId, interactionId);
  }

  private isS3Url(url: string): boolean {
    const s3BucketName = this.s3Service.getBucketName();
    return url.includes(s3BucketName);
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '@/infra/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/app/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
      createUserDto.email,
      hashedPassword,
      '',
      '',
      false,
      [],
      [],
      [],
      [],
      [],
      [],
    );
    return this.userRepository.create(user);
  }

  async createOAuthUser(profile: any): Promise<User> {
    const email = profile.emails?.[0]?.value;
    const username =
      profile.displayName ||
      profile.name?.givenName ||
      profile.emails?.[0]?.value;

    if (!email || !username) {
      throw new Error('Email or username not found in Google profile');
    }

    const user = new User(
      null,
      username,
      email,
      '',
      profile.photos[0].value,
      '',
      false,
      [],
      [],
      [],
      [],
      [],
      [],
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

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateProfileImage(userId: string, base64Image: string): Promise<User> {
    const user = await this.findById(userId);
    user.profileImage = base64Image;
    return this.userRepository.update(user);
  }

  async updateUserPassword(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  async addGameInteraction(
    userId: string,
    interactionId: string,
  ): Promise<void> {
    return this.userRepository.addGameInteraction(userId, interactionId);
  }

  async removeGameInteraction(
    userId: string,
    interactionId: string,
  ): Promise<void> {
    return this.userRepository.removeGameInteraction(userId, interactionId);
  }
}

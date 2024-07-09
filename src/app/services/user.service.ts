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
      false,
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
      true,
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

  async updateProfileImage(userId: string, base64Image: string): Promise<User> {
    const user = await this.findById(userId);
    user.updateProfileImage(base64Image);
    return this.userRepository.update(user);
  }

  async updateBio(userId: string, newBio: string): Promise<User> {
    const user = await this.findById(userId);
    user.updateBio(newBio);
    return this.userRepository.update(user);
  }

  async updateAt(userId: string, newAt: string): Promise<User> {
    const user = await this.findById(userId);
    user.updateAt(newAt);
    return this.userRepository.update(user);
  }

  async addGameInteraction(
    userId: string,
    interactionId: string,
  ): Promise<void> {
    await this.userRepository.addGameInteraction(userId, interactionId);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findById(userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.update(user);
  }
}

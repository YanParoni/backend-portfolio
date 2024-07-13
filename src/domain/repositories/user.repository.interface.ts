import { User } from '@/domain/entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(user: User): Promise<User>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  updateProfileImage(userId: string, profileImage: string): Promise<void>;
  updateHeaderImage(userId: string, headerImage: string): Promise<void>;
  updateBio(userId: string, bio: string): Promise<void>;
  updateAt(userId: string, at: string): Promise<void>;
  addGameInteraction(userId: string, interactionId: string): Promise<void>;
  removeGameInteraction(userId: string, interactionId: string): Promise<void>;
}

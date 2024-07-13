import { User } from '@/domain/entities/user.entity';

export function createMockUser(overrides: Partial<User> = {}): User {
  return new User(
    overrides.id || '1',
    overrides.username || 'testuser',
    overrides.at || '@testuser',
    overrides.email || 'test@example.com',
    overrides.password || 'hashedPassword',
    overrides.profileImage || '',
    overrides.headerImage || '',
    overrides.bio || '',
    overrides.isPrivate || false,
    overrides.followers || [],
    overrides.following || [],
    overrides.blockedUsers || [],
    overrides.reviews || [],
    overrides.likes || [],
    overrides.gameInteractions || [],
    overrides.oauth || false,
  );
}

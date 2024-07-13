import { Game } from '@/domain/entities/game.entity';

export const createMockGame = (overrides?: Partial<Game>): Game => {
  return new Game(
    overrides?.id || 'game-id',
    overrides?.gameId || 'game-id',
    overrides?.name || 'Test Game',
    overrides?.description || 'Test Description',
    overrides?.rating || 4.5,
    overrides?.released || new Date(),
    overrides?.backgroundImage || 'test-image.jpg',
    overrides?.tba || false,
    overrides?.addedByStatus || {},
    overrides?.publisher || 'Test Publisher',
    overrides?.stores || [],
  );
};

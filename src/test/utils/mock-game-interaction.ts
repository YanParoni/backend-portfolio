import { GameInteraction } from '@/domain/entities/game-interaction.entity';

export const createMockGameInteraction = (
  overrides?: Partial<GameInteraction>,
): GameInteraction => {
  return new GameInteraction(
    overrides?.id || 'interaction-id',
    overrides?.userId || 'user-id',
    overrides?.gameId || 'game-id',
    overrides?.liked || false,
    overrides?.played || false,
  );
};

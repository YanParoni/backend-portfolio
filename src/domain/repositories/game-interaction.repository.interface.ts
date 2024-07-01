import { GameInteraction } from '@/domain/entities/game-interaction.entity';

export interface IGameInteractionRepository {
  create(interaction: GameInteraction): Promise<GameInteraction>;
  findByUserAndGame(
    userId: string,
    gameId: string,
  ): Promise<GameInteraction | null>;
  update(interaction: GameInteraction): Promise<GameInteraction>;
}

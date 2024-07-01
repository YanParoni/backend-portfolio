import { GameInteraction } from '@/domain/entities/game-interaction.entity';

export interface IGameInteractionRepository {
  create(interaction: GameInteraction): Promise<GameInteraction>;
  update(interaction: GameInteraction): Promise<GameInteraction>;
  delete(id: string): Promise<void>;
  findAll(): Promise<GameInteraction[]>;
  findById(id: string): Promise<GameInteraction | null>;
  findByUserIdAndGameId(
    userId: string,
    gameId: string,
  ): Promise<GameInteraction | null>;
  findByUserId(userId: string): Promise<GameInteraction[]>;
}

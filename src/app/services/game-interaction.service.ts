import { Injectable, NotFoundException } from '@nestjs/common';
import { GameInteraction } from '@/domain/entities/game-interaction.entity';
import { GameInteractionRepository } from '@/infra/repositories/game-interaction.repository';

@Injectable()
export class GameInteractionService {
  constructor(
    private readonly interactionRepository: GameInteractionRepository,
  ) {}

  async createInteraction(
    userId: string,
    gameId: string,
    liked: boolean,
    played: boolean,
  ): Promise<GameInteraction> {
    const existingInteraction =
      await this.interactionRepository.findByUserAndGame(userId, gameId);
    if (existingInteraction) {
      existingInteraction.liked = liked;
      existingInteraction.played = played;
      return this.interactionRepository.update(existingInteraction);
    }
    const interaction = new GameInteraction(
      null,
      userId,
      gameId,
      liked,
      played,
    );
    return this.interactionRepository.create(interaction);
  }

  async getInteraction(
    userId: string,
    gameId: string,
  ): Promise<GameInteraction> {
    const interaction = await this.interactionRepository.findByUserAndGame(
      userId,
      gameId,
    );
    if (!interaction) {
      throw new NotFoundException(
        `No interaction found for game ${gameId} by user ${userId}`,
      );
    }
    return interaction;
  }
}

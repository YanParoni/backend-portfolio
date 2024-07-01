import { Injectable } from '@nestjs/common';
import { GameInteractionRepository } from '@/infra/repositories/game-interaction.repository';
import { GameInteraction } from '@/domain/entities/game-interaction.entity';
import { GameService } from '@/app/services/game.service';
import { ActivityService } from '@/app/services/activity.service';
import { Activity } from '@/domain/entities/activity.entity';

@Injectable()
export class GameInteractionService {
  constructor(
    private readonly interactionRepository: GameInteractionRepository,
    private readonly gameService: GameService,
    private readonly activityService: ActivityService,
  ) {}

  async createInteraction(
    userId: string,
    gameId: string,
    liked: boolean,
    played: boolean,
  ): Promise<GameInteraction> {
    const existingInteraction =
      await this.interactionRepository.findByUserIdAndGameId(userId, gameId);

    if (existingInteraction) {
      existingInteraction.liked = liked;
      existingInteraction.played = played;
      const updatedInteraction =
        await this.interactionRepository.update(existingInteraction);

      const activity = new Activity(
        null,
        liked ? 'like' : 'played',
        userId,
        gameId,
        new Date().toISOString(),
        'game',
        {},
      );
      await this.activityService.recordActivity(activity);

      return updatedInteraction;
    }

    const game = await this.gameService.findOrCreateGame(gameId);
    const interaction = new GameInteraction(
      null,
      userId,
      game.gameId,
      liked,
      played,
    );
    const createdInteraction =
      await this.interactionRepository.create(interaction);

    const activity = new Activity(
      null,
      liked ? 'like' : 'played',
      userId,
      gameId,
      new Date().toISOString(),
      'game',
      {},
    );
    await this.activityService.recordActivity(activity);

    return createdInteraction;
  }

  async getInteraction(
    userId: string,
    gameId: string,
  ): Promise<GameInteraction | null> {
    return this.interactionRepository.findByUserIdAndGameId(userId, gameId);
  }

  async getUserInteractions(userId: string): Promise<GameInteraction[]> {
    return this.interactionRepository.findByUserId(userId);
  }
}

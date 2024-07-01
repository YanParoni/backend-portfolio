import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { GameInteractionService } from '@/app/services/game-interaction.service';

@Controller('game-interactions')
export class GameInteractionController {
  constructor(private readonly interactionService: GameInteractionService) {}

  @Post(':gameId')
  async createInteraction(
    @Param('gameId') gameId: string,
    @Body('userId') userId: string,
    @Body('liked') liked: boolean,
    @Body('played') played: boolean,
  ) {
    return this.interactionService.createInteraction(
      userId,
      gameId,
      liked,
      played,
    );
  }

  @Get(':gameId/:userId')
  async getInteraction(
    @Param('gameId') gameId: string,
    @Param('userId') userId: string,
  ) {
    return this.interactionService.getInteraction(userId, gameId);
  }
}

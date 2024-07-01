import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { GameInteractionService } from '@/app/services/game-interaction.service';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('game-interactions')
export class GameInteractionController {
  constructor(private readonly interactionService: GameInteractionService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':gameId')
  async createInteraction(
    @Param('gameId') gameId: string,
    @Body('liked') liked: boolean,
    @Body('played') played: boolean,
    @Req() req: AuthenticatedRequest,
  ) {
    req.headers['activity-type'] = liked ? 'like' : played ? 'played' : '';
    req.headers['target-type'] = 'game';
    const userId = req.user._id;
    return this.interactionService.createInteraction(
      userId,
      gameId,
      liked,
      played,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('game/:gameId/user/:userId')
  async getInteraction(
    @Param('gameId') gameId: string,
    @Param('userId') userId: string,
  ) {
    return this.interactionService.getInteraction(userId, gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getUserInteractions(@Param('userId') userId: string) {
    return this.interactionService.getUserInteractions(userId);
  }
}

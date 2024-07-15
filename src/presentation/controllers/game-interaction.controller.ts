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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('game-interactions')
@Controller('game-interactions')
export class GameInteractionController {
  constructor(private readonly interactionService: GameInteractionService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':gameId')
  @ApiOperation({ summary: 'Create a game interaction' })
  @ApiParam({ name: 'gameId', required: true, description: 'Game ID' })
  async createInteraction(
    @Param('gameId') gameId: string,
    @Body('liked') liked: boolean,
    @Body('played') played: boolean,
    @Req() req: AuthenticatedRequest,
  ) {
    req.headers['activity-type'] = liked ? 'like' : played ? 'played' : '';
    req.headers['target-type'] = 'game';
    const userId = req.user.sub;
    return this.interactionService.createInteraction(
      userId,
      gameId,
      liked,
      played,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('game/:gameId/user/:userId')
  @ApiOperation({ summary: 'Get game interaction' })
  @ApiParam({ name: 'gameId', required: true, description: 'Game ID' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  async getInteraction(
    @Param('gameId') gameId: string,
    @Param('userId') userId: string,
  ) {
    return this.interactionService.getInteraction(userId, gameId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user interactions' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  async getUserInteractions(@Param('userId') userId: string) {
    return this.interactionService.getUserInteractions(userId);
  }
}

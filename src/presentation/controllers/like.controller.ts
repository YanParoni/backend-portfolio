import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikeService } from '@/app/services/like.service';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('review/:reviewId')
  async likeReview(
    @Req() req: AuthenticatedRequest,
    @Param('reviewId') reviewId: string,
  ) {
    return this.likeService.likeReview(req.user._id, reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('game/:gameId')
  async likeGame(
    @Req() req: AuthenticatedRequest,
    @Param('gameId') gameId: string,
  ) {
    return this.likeService.likeGame(req.user._id, gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async unlike(@Param('id') id: string) {
    return this.likeService.unlike(id);
  }
}

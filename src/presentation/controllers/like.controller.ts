import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
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
    req.headers['activity-type'] = 'like';
    req.headers['target-type'] = 'review';
    return this.likeService.likeReview(req.user.sub, reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('list/:listId')
  async likeList(
    @Req() req: AuthenticatedRequest,
    @Param('listId') listId: string,
  ) {
    req.headers['activity-type'] = 'like';
    req.headers['target-type'] = 'list';
    return this.likeService.likeList(req.user.sub, listId);
  }
}

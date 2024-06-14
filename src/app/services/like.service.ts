import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeRepository } from '@/infra/repositories/like.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { GameService } from '@/app/services/game.service';
import { Like } from '@/domain/entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly gameService: GameService,
  ) {}

  async likeReview(userId: string, reviewId: string): Promise<Like> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const like = new Like(null, userId, reviewId, 'review');
    return this.likeRepository.create(like);
  }

  async likeGame(userId: string, gameId: string): Promise<Like> {
    this.gameService.findOrCreateGame(gameId);

    const like = new Like(null, userId, gameId, 'game');
    return this.likeRepository.create(like);
  }

  async unlike(id: string): Promise<void> {
    await this.likeRepository.delete(id);
  }

  async findAll(): Promise<Like[]> {
    return this.likeRepository.findAll();
  }
}

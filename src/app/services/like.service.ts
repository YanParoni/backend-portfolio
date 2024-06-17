import { Injectable } from '@nestjs/common';
import { LikeRepository } from '@/infra/repositories/like.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { GameService } from '@/app/services/game.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { Like } from '@/domain/entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly gameService: GameService,
    private readonly userRepository: UserRepository,
  ) {}

  async likeReview(userId: string, reviewId: string): Promise<Like> {
    const review = await this.reviewRepository.findById(reviewId);
    review.addLike();
    await this.reviewRepository.update(review);

    const like = new Like(null, userId, reviewId, 'review');
    const createdLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findById(userId);
    user.addLike(createdLike.id);
    await this.userRepository.update(user);

    return createdLike;
  }

  async likeGame(userId: string, gameId: string): Promise<Like> {
    const game = await this.gameService.findOrCreateGame(gameId);
    const like = new Like(null, userId, game.gameId, 'game');
    const createdLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findById(userId);
    user.addLike(createdLike.id);
    await this.userRepository.update(user);

    return createdLike;
  }

  async unlike(likeId: string): Promise<void> {
    const like = await this.likeRepository.findById(likeId);
    if (like.targetType === 'review') {
      const review = await this.reviewRepository.findById(like.targetId);
      review.removeLike();
      await this.reviewRepository.update(review);
    }

    await this.likeRepository.delete(likeId);

    const user = await this.userRepository.findById(like.userId);
    user.removeLike(likeId);
    await this.userRepository.update(user);
  }
}

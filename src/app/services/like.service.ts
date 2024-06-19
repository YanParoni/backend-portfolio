import { Injectable } from '@nestjs/common';
import { LikeRepository } from '@/infra/repositories/like.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { GameService } from '@/app/services/game.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { Like } from '@/domain/entities/like.entity';
import { RegisterActivity } from '@/infra/decorators/register.activity.decorator';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly gameService: GameService,
    private readonly userRepository: UserRepository,
  ) {}

  @RegisterActivity('like', 'review', async (context) => {
    const reviewRepository = context
      .switchToHttp()
      .getRequest().reviewRepository;
    const request = context.switchToHttp().getRequest();
    const review = await reviewRepository.findById(request.params.reviewId);
    return { reviewTitle: review.title };
  })
  async likeReview(userId: string, reviewId: string): Promise<Like> {
    const like = new Like(null, userId, reviewId, 'review');
    const createdLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findById(userId);
    user.addLike(createdLike.id);
    await this.userRepository.update(user);

    const review = await this.reviewRepository.findById(reviewId);
    review.addLike();
    await this.reviewRepository.update(review);

    return createdLike;
  }

  @RegisterActivity('like', 'game', async (context) => {
    const gameService = context.switchToHttp().getRequest().gameService;
    const request = context.switchToHttp().getRequest();
    const game = await gameService.findById(request.params.gameId);
    return { gameTitle: game.name };
  })
  async likeGame(userId: string, gameId: string): Promise<Like> {
    const game = await this.gameService.findOrCreateGame(gameId);
    console.log(game);
    const like = new Like(null, userId, game.gameId, 'game');
    const createdLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findById(userId);
    user.addLike(createdLike.id);
    await this.userRepository.update(user);

    return createdLike;
  }

  async unlike(id: string): Promise<void> {
    await this.likeRepository.delete(id);
  }
}

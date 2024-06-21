import { Injectable } from '@nestjs/common';
import { LikeRepository } from '@/infra/repositories/like.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { GameService } from '@/app/services/game.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { ListRepository } from '@/infra/repositories/list.repository';
import { NotificationGateway } from '@/infra/gateways/notification.gateway';
import { Like } from '@/domain/entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly gameService: GameService,
    private readonly userRepository: UserRepository,
    private readonly listRepository: ListRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async likeReview(userId: string, reviewId: string): Promise<Like | void> {
    const existingLike = await this.likeRepository.findByUserIdAndTargetId(
      userId,
      reviewId,
    );
    if (existingLike) {
      await this.unlike(existingLike.id, userId, 'review', reviewId);
      return;
    }

    const like = new Like(null, userId, reviewId, 'review');
    const createdLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findById(userId);
    user.addLike(createdLike.id);
    await this.userRepository.update(user);

    const review = await this.reviewRepository.findById(reviewId);
    review.addLike();
    await this.reviewRepository.update(review);

    this.notificationGateway.sendNotification(review.userId, {
      type: 'like',
      targetType: 'review',
      targetId: reviewId,
      userId,
      timestamp: new Date().toISOString(),
    });

    return createdLike;
  }

  async likeGame(userId: string, gameId: string): Promise<Like | void> {
    const existingLike = await this.likeRepository.findByUserIdAndTargetId(
      userId,
      gameId,
    );
    if (existingLike) {
      await this.unlike(existingLike.id, userId, 'game', gameId);
      return;
    }

    const game = await this.gameService.findOrCreateGame(gameId);
    const like = new Like(null, userId, game.gameId, 'game');
    const createdLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findById(userId);
    user.addLike(createdLike.id);
    await this.userRepository.update(user);

    return createdLike;
  }

  async likeList(userId: string, listId: string): Promise<Like | void> {
    const existingLike = await this.likeRepository.findByUserIdAndTargetId(
      userId,
      listId,
    );
    if (existingLike) {
      await this.unlike(existingLike.id, userId, 'list', listId);
      return;
    }

    const like = new Like(null, userId, listId, 'list');
    const createdLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findById(userId);
    user.addLike(createdLike.id);
    await this.userRepository.update(user);

    const list = await this.listRepository.findById(listId);
    list.likesCount += 1;
    await this.listRepository.update(list);
    this.notificationGateway.sendNotification(list.userId, {
      type: 'like',
      targetType: 'list',
      targetId: listId,
      userId,
      timestamp: new Date().toISOString(),
    });
    return createdLike;
  }

  async unlike(
    likeId: string,
    userId: string,
    targetType: 'review' | 'game' | 'list',
    targetId: string,
  ): Promise<void> {
    await this.likeRepository.delete(likeId);

    const user = await this.userRepository.findById(userId);
    user.removeLike(likeId);
    await this.userRepository.update(user);

    if (targetType === 'review') {
      const review = await this.reviewRepository.findById(targetId);
      review.removeLike();
      await this.reviewRepository.update(review);
    } else if (targetType === 'list') {
      const list = await this.listRepository.findById(targetId);
      list.likesCount -= 1;
      await this.listRepository.update(list);
    }
  }
}

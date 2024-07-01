import { Injectable } from '@nestjs/common';
import { LikeRepository } from '@/infra/repositories/like.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { UserRepository } from '@/infra/repositories/user.repository';
import { ListRepository } from '@/infra/repositories/list.repository';
import { ActivityService } from '@/app/services/activity.service';
import { Like } from '@/domain/entities/like.entity';
import { Activity } from '@/domain/entities/activity.entity';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly listRepository: ListRepository,
    private readonly activityService: ActivityService,
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
    review.addLike(createdLike.id);
    await this.reviewRepository.update(review);

    const activity = new Activity(
      null,
      'like',
      userId,
      reviewId,
      new Date().toISOString(),
      'review',
      {},
    );
    await this.activityService.recordActivity(activity);

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
    list.addLike(createdLike.id);
    await this.listRepository.update(list);

    const activity = new Activity(
      null,
      'like',
      userId,
      listId,
      new Date().toISOString(),
      'list',
      {},
    );
    await this.activityService.recordActivity(activity);

    return createdLike;
  }

  async unlike(
    likeId: string,
    userId: string,
    targetType: 'review' | 'list',
    targetId: string,
  ): Promise<void> {
    await this.likeRepository.delete(likeId);

    const user = await this.userRepository.findById(userId);
    user.removeLike(likeId);
    await this.userRepository.update(user);

    if (targetType === 'review') {
      const review = await this.reviewRepository.findById(targetId);
      review.removeLike(likeId);
      await this.reviewRepository.update(review);
    } else if (targetType === 'list') {
      const list = await this.listRepository.findById(targetId);
      list.removeLike(likeId);
      await this.listRepository.update(list);
    }
  }
}

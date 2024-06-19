import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '@/infra/repositories/activity.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { UserRepository } from '@/infra/repositories/user.repository';
import { CommentRepository } from '@/infra/repositories/comment.repository';
import { GameRepository } from '@/infra/repositories/game.repository';
import { Activity } from '@/domain/entities/activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  async recordActivity(activity: Activity): Promise<Activity> {
    return this.activityRepository.create(activity);
  }

  async getTimeline(userId: string): Promise<Activity[]> {
    const activities = await this.activityRepository.findByUserId(userId);

    return Promise.all(
      activities.map(async (activity) => {
        const user = await this.userRepository.findById(activity.userId);
        const details = { user };

        if (activity.targetType === 'review') {
          details['review'] = await this.reviewRepository.findById(
            activity.targetId,
          );
        } else if (activity.targetType === 'comment') {
          details['comment'] = await this.commentRepository.findById(
            activity.targetId,
          );
        } else if (activity.targetType === 'game') {
          details['game'] = await this.gameRepository.findById(
            activity.targetId,
          );
        }

        return {
          ...activity,
          details,
        };
      }),
    );
  }
}

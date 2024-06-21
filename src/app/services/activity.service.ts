import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '@/infra/repositories/activity.repository';
import { Activity } from '@/domain/entities/activity.entity';
import { UserRepository } from '@/infra/repositories/user.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { CommentRepository } from '@/infra/repositories/comment.repository';
import { GameRepository } from '@/infra/repositories/game.repository';
import { NotificationGateway } from '@/infra/gateways/notification.gateway';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly commentRepository: CommentRepository,
    private readonly gameRepository: GameRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async recordActivity(activity: Activity): Promise<Activity> {
    const recordedActivity = await this.activityRepository.create(activity);

    const user = await this.userRepository.findById(activity.userId);
    user.followers.forEach((followerId) => {
      this.notificationGateway.sendNotification(followerId, recordedActivity);
    });

    return recordedActivity;
  }

  async getTimeline(userId: string): Promise<any[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const followingIds = user.following;

    const activities =
      await this.activityRepository.findByUserIds(followingIds);

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

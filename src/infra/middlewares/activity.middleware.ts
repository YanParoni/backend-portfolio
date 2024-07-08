import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ActivityService } from '@/app/services/activity.service';
import { Activity } from '@/domain/entities/activity.entity';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Injectable()
export class ActivityMiddleware implements NestMiddleware {
  constructor(private readonly activityService: ActivityService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      const activityType = req.headers['activity-type'] as string;
      const targetType = req.headers['target-type'] as string;
      console.log(activityType, targetType);
      const userId = req.user._id;
      const targetId =
        req.params.gameId ||
        req.params.reviewId ||
        req.params.listId ||
        req.params.commentId;

      if (activityType && targetType && userId && targetId) {
        const details = req.body.details || {};
        const activity = new Activity(
          null,
          activityType,
          userId,
          targetId,
          new Date().toISOString(),
          targetType as 'list' | 'review' | 'game' | 'comment',
          details,
        );
        await this.activityService.recordActivity(activity);
      }
    });
    next();
  }
}

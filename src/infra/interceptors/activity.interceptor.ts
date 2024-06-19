import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { GetDetailsFunction } from '../decorators/register.activity.decorator';
import { ActivityService } from '@/app/services/activity.service';
import { Activity } from '@/domain/entities/activity.entity';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly activityService: ActivityService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const activityType = this.reflector.get<string>(
      'activityType',
      context.getHandler(),
    );
    const targetType = this.reflector.get<string>(
      'targetType',
      context.getHandler(),
    );
    const getDetails = this.reflector.get<GetDetailsFunction>(
      'getDetails',
      context.getHandler(),
    );

    return next.handle().pipe(
      map(async (data) => {
        const request = context.switchToHttp().getRequest();
        const userId = request.user._id;
        const targetId = request.params.id;
        const details = await getDetails(context);

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

        return data;
      }),
    );
  }
}

import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ActivityInterceptor } from '../interceptors/activity.interceptor';
import { ExecutionContext } from '@nestjs/common';

export type GetDetailsFunction = (context: ExecutionContext) => any;

export const RegisterActivity = (
  activityType: 'like' | 'comment' | 'review' | 'likeGame',
  targetType: 'list' | 'review' | 'game' | 'comment',
  getDetails: GetDetailsFunction,
) => {
  return applyDecorators(
    SetMetadata('activityType', activityType),
    SetMetadata('targetType', targetType),
    SetMetadata('getDetails', getDetails),
    UseInterceptors(ActivityInterceptor),
  );
};

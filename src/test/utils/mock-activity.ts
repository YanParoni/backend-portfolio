import { Activity } from '@/domain/entities/activity.entity';

export const createMockActivity = (overrides?: Partial<Activity>): Activity => {
  return new Activity(
    overrides?.id || 'activity-id',
    overrides?.type || 'like',
    overrides?.userId || 'user-id',
    overrides?.targetId || 'target-id',
    overrides?.timestamp || new Date().toISOString(),
    overrides?.targetType || 'game',
    overrides?.details || {},
  );
};

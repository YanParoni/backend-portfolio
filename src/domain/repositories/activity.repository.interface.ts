import { Activity } from '@/domain/entities/activity.entity';

export interface IActivityRepository {
  create(activity: Activity): Promise<Activity>;
  findByUserId(userId: string): Promise<Activity[]>;
}

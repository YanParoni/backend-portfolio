import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActivityDocument,
  ActivitySchema,
} from '@/infra/schemas/activity.schema';
import { Activity } from '@/domain/entities/activity.entity';
import { IActivityRepository } from '@/domain/repositories/activity.repository.interface';

@Injectable()
export class ActivityRepository implements IActivityRepository {
  constructor(
    @InjectModel(ActivitySchema.name)
    private activityModel: Model<ActivityDocument>,
  ) {}

  private toDomain(activityDocument: ActivityDocument): Activity {
    return new Activity(
      activityDocument._id.toString(),
      activityDocument.type,
      activityDocument.userId,
      activityDocument.targetId,
      activityDocument.timestamp,
      activityDocument.targetType as 'list' | 'review' | 'game' | 'comment',
      activityDocument.details as Record<string, any>,
    );
  }

  private toSchema(activity: Activity): Partial<ActivityDocument> {
    return {
      type: activity.type,
      userId: activity.userId,
      targetId: activity.targetId,
      timestamp: activity.timestamp,
      targetType: activity.targetType,
      details: activity.details,
    };
  }

  async create(activity: Activity): Promise<Activity> {
    const createdActivity = new this.activityModel(this.toSchema(activity));
    const savedActivity = await createdActivity.save();
    return this.toDomain(savedActivity);
  }

  async findByUserId(userId: string): Promise<Activity[]> {
    const activityDocuments = await this.activityModel.find({ userId }).exec();
    return activityDocuments.map((doc) => this.toDomain(doc));
  }
}

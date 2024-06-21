import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from '@/presentation/controllers/activity.controller';
import { ActivityService } from '@/app/services/activity.service';
import { ActivityRepository } from '@/infra/repositories/activity.repository';
import {
  ActivitySchema,
  ActivitySchemaSchema,
} from '@/infra/schemas/activity.schema';
import { UserModule } from '@/infra/modules/user.module';
import { ReviewModule } from '@/infra/modules/review.module';
import { CommentModule } from '@/infra/modules/comment.module';
import { GameModule } from '@/infra/modules/game.module';
import { ListModule } from './list.module';
import { NotificationGateway } from '@/infra/gateways/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivitySchema.name, schema: ActivitySchemaSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => CommentModule),
    forwardRef(() => GameModule),
    forwardRef(() => ListModule),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository, NotificationGateway],
  exports: [ActivityService, ActivityRepository, NotificationGateway],
})
export class ActivityModule {}

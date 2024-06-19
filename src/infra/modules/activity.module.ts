// src/infra/modules/activity.module.ts
import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivitySchema.name, schema: ActivitySchemaSchema },
    ]),
    UserModule,
    ReviewModule,
    CommentModule,
    GameModule, // Adicionando GameModule
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository],
  exports: [ActivityService, ActivityRepository],
})
export class ActivityModule {}

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeController } from '@/presentation/controllers/like.controller';
import { LikeService } from '@/app/services/like.service';
import { LikeSchema, LikeSchemaSchema } from '@/infra/schemas/like.schema';
import {
  ReviewSchema,
  ReviewSchemaSchema,
} from '@/infra/schemas/review.schema';
import { LikeRepository } from '@/infra/repositories/like.repository';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { UserModule } from '@/infra/modules/user.module';
import { ActivityModule } from '@/infra/modules/activity.module';
import { ListModule } from './list.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LikeSchema.name, schema: LikeSchemaSchema },
      { name: ReviewSchema.name, schema: ReviewSchemaSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => ActivityModule),
    forwardRef(() => ListModule),
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository, ReviewRepository],
  exports: [LikeService, LikeRepository],
})
export class LikeModule {}

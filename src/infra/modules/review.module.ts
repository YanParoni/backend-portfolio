import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from '@/app/services/review.service';
import { ReviewController } from '@/presentation/controllers/review.controller';
import {
  ReviewSchema,
  ReviewSchemaSchema,
} from '@/infra/schemas/review.schema';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { UserModule } from '@/infra/modules/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewSchema.name, schema: ReviewSchemaSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}

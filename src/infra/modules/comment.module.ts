import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from '@/presentation/controllers/comment.controller';
import { CommentService } from '@/app/services/comment.service';
import {
  CommentSchema,
  CommentSchemaSchema,
} from '@/infra/schemas/comment.schema';
import { CommentRepository } from '@/infra/repositories/comment.repository';
import { UserModule } from '@/infra/modules/user.module';
import { ListModule } from '@/infra/modules/list.module';
import { ReviewModule } from '@/infra/modules/review.module';
import { ActivityModule } from './activity.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentSchema.name, schema: CommentSchemaSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => ListModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => ActivityModule),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}

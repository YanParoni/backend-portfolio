import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialsController } from '@/presentation/controllers/socials.controller';
import { SocialService } from '@/app/services/socials.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { CommentRepository } from '@/infra/repositories/comment.repository';
import { UserSchema, UserSchemaSchema } from '@/infra/schemas/user.schema';
import {
  CommentSchema,
  CommentSchemaSchema,
} from '@/infra/schemas/comment.schema';
import { UserModule } from '@/infra/modules/user.module';
import { ActivityModule } from '@/infra/modules/activity.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaSchema },
      { name: CommentSchema.name, schema: CommentSchemaSchema },
    ]),
    ActivityModule,
  ],
  controllers: [SocialsController],
  providers: [SocialService, UserRepository, CommentRepository],
  exports: [SocialService],
})
export class SocialModule {}

import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@/infra/modules/user.module';
import { AuthModule } from '@/infra/modules/auth.module';
import { ReviewModule } from '@/infra/modules/review.module';
import { SocialModule } from '@/infra/modules/socials.module';
import { LikeModule } from '@/infra/modules/like.module';
import { ActivityModule } from '@/infra/modules/activity.module';
import { ActivityMiddleware } from '@/infra/middlewares/activity.middleware';
import { ListModule } from './infra/modules/list.module';
import { CommentModule } from './infra/modules/comment.module';
import { GameInteractionModule } from './infra/modules/game-interaction.module';
import { EmailModule } from './infra/modules/email.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => SocialModule),
    forwardRef(() => LikeModule),
    forwardRef(() => ActivityModule),
    forwardRef(() => ListModule),
    forwardRef(() => CommentModule),
    forwardRef(() => GameInteractionModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ActivityMiddleware)
      .forRoutes(
        { path: 'likes/review/:reviewId', method: RequestMethod.POST },
        { path: 'likes/list/:listId', method: RequestMethod.POST },
        { path: 'comments', method: RequestMethod.POST },
        { path: 'game-interactions/:gameId', method: RequestMethod.POST },
        { path: 'reviews', method: RequestMethod.POST },
      );
  }
}

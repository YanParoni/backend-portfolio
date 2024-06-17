import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@/infra/modules/user.module';
import { AuthModule } from '@/infra/modules/auth.module';
import { ReviewModule } from '@/infra/modules/review.module';
import { SocialsModule } from '@/infra/modules/socials.module';
import { LikeModule } from '@/infra/modules/like.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    UserModule,
    AuthModule,
    ReviewModule,
    SocialsModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

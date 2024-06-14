import { Module, forwardRef } from '@nestjs/common';
import { SocialService } from '@/app/services/socials.service';
import { SocialsController } from '@/presentation/controllers/socials.controller';
import { UserModule } from '@/infra/modules/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [SocialsController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialsModule {}

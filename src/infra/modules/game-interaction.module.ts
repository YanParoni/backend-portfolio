import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameInteractionRepository } from '@/infra/repositories/game-interaction.repository';
import {
  GameInteractionSchema,
  GameInteractionSchemaSchema,
} from '@/infra/schemas/game-interaction.schema';
import { GameInteractionService } from '@/app/services/game-interaction.service';
import { UserModule } from '@/infra/modules/user.module';
import { AuthModule } from '@/infra/modules/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameInteractionSchema.name, schema: GameInteractionSchemaSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  providers: [GameInteractionService, GameInteractionRepository],
  exports: [GameInteractionService, GameInteractionRepository],
})
export class GameInteractionModule {}

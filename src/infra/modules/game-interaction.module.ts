import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameInteractionController } from '@/presentation/controllers/game-interaction.controller';
import { GameInteractionService } from '@/app/services/game-interaction.service';
import { GameInteractionRepository } from '@/infra/repositories/game-interaction.repository';
import {
  GameInteractionSchema,
  GameInteractionSchemaSchema,
} from '@/infra/schemas/game-interaction.schema';
import { GameModule } from '@/infra/modules/game.module';
import { UserModule } from '@/infra/modules/user.module';
import { ActivityModule } from '@/infra/modules/activity.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameInteractionSchema.name, schema: GameInteractionSchemaSchema },
    ]),
    forwardRef(() => GameModule),
    forwardRef(() => UserModule),
    forwardRef(() => ActivityModule),
  ],
  controllers: [GameInteractionController],
  providers: [GameInteractionService, GameInteractionRepository],
  exports: [GameInteractionService, GameInteractionRepository],
})
export class GameInteractionModule {}

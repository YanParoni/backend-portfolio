import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameService } from '@/app/services/game.service';
import { GameSchema, GameSchemaSchema } from '@/infra/schemas/game.schema';
import { GameRepository } from '@/infra/repositories/game.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameSchema.name, schema: GameSchemaSchema },
    ]),
    HttpModule,
  ],
  providers: [GameService, GameRepository],
  exports: [GameService, GameRepository],
})
export class GameModule {}

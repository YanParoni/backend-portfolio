// src/infra/modules/list.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from '@/presentation/controllers/list.controller';
import { ListService } from '@/app/services/list.service';
import { ListSchema, ListSchemaSchema } from '@/infra/schemas/list.schema';
import { ListRepository } from '@/infra/repositories/list.repository';
import { GameModule } from './game.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListSchema.name, schema: ListSchemaSchema },
    ]),
    GameModule,
  ],
  controllers: [ListController],
  providers: [ListService, ListRepository],
  exports: [ListService, ListRepository],
})
export class ListModule {}

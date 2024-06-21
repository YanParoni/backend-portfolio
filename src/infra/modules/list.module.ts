import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from '@/presentation/controllers/list.controller';
import { ListService } from '@/app/services/list.service';
import { ListSchema, ListSchemaSchema } from '@/infra/schemas/list.schema';
import { ListRepository } from '@/infra/repositories/list.repository';
import { GameModule } from './game.module';
import { ActivityModule } from '@/infra/modules/activity.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListSchema.name, schema: ListSchemaSchema },
    ]),
    forwardRef(() => GameModule),
    forwardRef(() => ActivityModule),
  ],
  controllers: [ListController],
  providers: [ListService, ListRepository],
  exports: [ListService, ListRepository],
})
export class ListModule {}

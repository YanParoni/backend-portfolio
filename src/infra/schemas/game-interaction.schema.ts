import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameInteractionDocument = GameInteractionSchema & Document;

@Schema()
export class GameInteractionSchema {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  gameId: string;

  @Prop({ default: false })
  liked: boolean;

  @Prop({ default: false })
  played: boolean;
}

export const GameInteractionSchemaSchema = SchemaFactory.createForClass(
  GameInteractionSchema,
);

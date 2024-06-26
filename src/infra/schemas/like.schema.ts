import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LikeDocument = LikeSchema & Document;

@Schema()
export class LikeSchema {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true })
  targetType: 'review' | 'list';
}

export const LikeSchemaSchema = SchemaFactory.createForClass(LikeSchema);

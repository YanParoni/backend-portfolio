import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityDocument = ActivitySchema & Document;

@Schema()
export class ActivitySchema {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: true })
  targetType: 'list' | 'review' | 'game' | 'comment';

  @Prop({ type: Map, of: String })
  details: Record<string, any>;
}

export const ActivitySchemaSchema =
  SchemaFactory.createForClass(ActivitySchema);

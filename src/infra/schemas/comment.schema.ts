import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = CommentSchema & Document;

@Schema()
export class CommentSchema {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  authorUsername: string;

  @Prop({ required: true })
  authorProfileImage: string;

  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true })
  targetType: 'list' | 'review';

  @Prop({ required: true, default: false })
  isBlocked: boolean;
}

export const CommentSchemaSchema = SchemaFactory.createForClass(CommentSchema);

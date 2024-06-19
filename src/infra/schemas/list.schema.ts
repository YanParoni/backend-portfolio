import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListDocument = ListSchema & Document;

@Schema()
export class ListSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ required: true, type: [String] })
  comments: string[];

  @Prop({ required: true, type: [String] })
  games: string[];
}

export const ListSchemaSchema = SchemaFactory.createForClass(ListSchema);

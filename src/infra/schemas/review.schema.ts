import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = ReviewSchema & Document;

@Schema()
export class ReviewSchema {
  @Prop({ required: true })
  gameTitle: string;

  @Prop({ required: true })
  gameReleaseDate: string;

  @Prop({ required: true })
  gameImage: string;

  @Prop({ required: true })
  reviewDate: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true, type: [String] })
  likes: string[];

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userProfileImage: string;

  @Prop({ required: true })
  userId: string;
}

export const ReviewSchemaSchema = SchemaFactory.createForClass(ReviewSchema);

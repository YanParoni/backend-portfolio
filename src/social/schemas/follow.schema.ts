import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

@Schema()
export class Follow {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  follower: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  following: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

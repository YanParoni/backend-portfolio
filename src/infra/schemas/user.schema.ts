import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = UserSchema & Document;

@Schema()
export class UserSchema {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  profileImage: string;

  @Prop()
  bio: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  followers: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  following: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  blockedUsers: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Game' })
  favorites: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Review' })
  reviews: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Like' })
  likes: MongooseSchema.Types.ObjectId[];
}

export const UserSchemaSchema = SchemaFactory.createForClass(UserSchema);

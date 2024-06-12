import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  bio: string;

  @Prop()
  profileImage: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  followers: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  following: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  blockedUsers: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Game' })
  favorites: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Review' })
  reviews: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Like' })
  likes: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

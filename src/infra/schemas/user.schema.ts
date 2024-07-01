// src/infra/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ ref: 'User' })
  followers: string[];

  @Prop({ ref: 'User' })
  following: string[];

  @Prop({ ref: 'User' })
  blockedUsers: string[];

  @Prop({ ref: 'Review' })
  reviews: string[];

  @Prop({ ref: 'Like' })
  likes: string[];

  @Prop({ ref: 'GameInteraction' })
  gameInteractions: string[];
}

export const UserSchemaSchema = SchemaFactory.createForClass(UserSchema);

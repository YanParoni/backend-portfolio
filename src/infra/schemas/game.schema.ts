import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = GameSchema & Document;

@Schema()
export class GameSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  released: Date;

  @Prop({ required: true })
  backgroundImage: string;

  @Prop({ required: true })
  tba: boolean;

  @Prop({ required: true, type: Map, of: Number })
  addedByStatus: Record<string, number>;

  @Prop({ required: true })
  publisher: string;

  @Prop({
    required: true,
    type: [
      {
        id: { type: Number, required: true },
        url: { type: String, required: true },
        store: {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          slug: { type: String, required: true },
          domain: { type: String, required: true },
          gamesCount: { type: Number, required: true },
          imageBackground: { type: String, required: true },
        },
      },
    ],
  })
  stores: {
    id: number;
    url: string;
    store: {
      id: number;
      name: string;
      slug: string;
      domain: string;
      gamesCount: number;
      imageBackground: string;
    };
  }[];
}

export const GameSchemaSchema = SchemaFactory.createForClass(GameSchema);

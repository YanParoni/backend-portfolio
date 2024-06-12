import { Document } from 'mongoose';

export interface Review {
  gameId: string;
  reviewText: string;
  rating: number;
  date: Date;
}

export interface User extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  favorites: string[];
  reviews: Review[];
  likes: string[];
}

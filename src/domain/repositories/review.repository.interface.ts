import { Review } from '@/domain/entities/review.entity';

export interface IReviewRepository {
  create(review: Review): Promise<Review>;
  findAll(): Promise<Review[]>;
  findByGame(gameTitle: string): Promise<Review[]>;
  findByUser(userName: string): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  update(review: Review): Promise<Review>;
  delete(id: string): Promise<void>;
}

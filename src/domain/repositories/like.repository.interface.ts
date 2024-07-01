import { Like } from '@/domain/entities/like.entity';
export interface ILikeRepository {
  create(like: Like): Promise<Like>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Like[]>;
  findByUserIdAndTargetId(
    userId: string,
    targetId: string,
  ): Promise<Like | null>;
  findById(id: string): Promise<Like | null>;
}

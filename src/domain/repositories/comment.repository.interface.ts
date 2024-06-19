// src/domain/repositories/comment.repository.interface.ts

import { Comment } from '@/domain/entities/comment.entity';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  update(comment: Comment): Promise<Comment>;
  findByTarget(
    targetId: string,
    targetType: 'list' | 'review',
  ): Promise<Comment[]>;
  findAll(): Promise<Comment[]>;
  delete(id: string): Promise<void>;
}

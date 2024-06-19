import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@/infra/repositories/comment.repository';
import { Comment } from '@/domain/entities/comment.entity';
import { CreateCommentDto } from '@/app/dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
    authorUsername: string,
    authorProfileImage: string,
  ): Promise<Comment> {
    const comment = new Comment(
      null,
      createCommentDto.content,
      new Date().toISOString(),
      new Date().toISOString(),
      authorId,
      authorUsername,
      authorProfileImage,
      createCommentDto.targetId,
      createCommentDto.targetType,
      false,
    );
    return this.commentRepository.create(comment);
  }
  async findByTarget(
    targetId: string,
    targetType: 'list' | 'review',
  ): Promise<Comment[]> {
    return this.commentRepository.findByTarget(targetId, targetType);
  }
}

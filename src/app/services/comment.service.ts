import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@/infra/repositories/comment.repository';
import { Comment } from '@/domain/entities/comment.entity';
import { CreateCommentDto } from '@/app/dto/create-comment.dto';
import { ActivityService } from '@/app/services/activity.service';
import { Activity } from '@/domain/entities/activity.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly activityService: ActivityService,
  ) {}
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
    const createdComment = await this.commentRepository.create(comment);

    const activity = new Activity(
      null,
      'comment',
      authorId,
      createdComment.id,
      new Date().toISOString(),
      createCommentDto.targetType,
      { content: createCommentDto.content },
    );
    await this.activityService.recordActivity(activity);

    return createdComment;
  }

  async findByTarget(
    targetId: string,
    targetType: 'list' | 'review',
  ): Promise<Comment[]> {
    return this.commentRepository.findByTarget(targetId, targetType);
  }
}

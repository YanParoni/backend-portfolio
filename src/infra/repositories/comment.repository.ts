import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentSchema, CommentDocument } from '@/infra/schemas/comment.schema';
import { Comment as CommentEntity } from '@/domain/entities/comment.entity';
import { ICommentRepository } from '@/domain/repositories/comment.repository.interface';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectModel(CommentSchema.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  private toDomain(commentDocument: CommentDocument): CommentEntity {
    return new CommentEntity(
      commentDocument._id.toString(),
      commentDocument.content,
      commentDocument.createdAt,
      commentDocument.updatedAt,
      commentDocument.authorId,
      commentDocument.authorUsername,
      commentDocument.authorProfileImage,
      commentDocument.targetId,
      commentDocument.targetType,
      commentDocument.isBlocked,
    );
  }

  private toSchema(comment: CommentEntity): Partial<CommentDocument> {
    return {
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      authorId: comment.authorId,
      authorUsername: comment.authorUsername,
      authorProfileImage: comment.authorProfileImage,
      targetId: comment.targetId,
      targetType: comment.targetType,
      isBlocked: comment.isBlocked,
    };
  }

  async create(comment: CommentEntity): Promise<CommentEntity> {
    const createdComment = new this.commentModel(this.toSchema(comment));
    const savedComment = await createdComment.save();
    return this.toDomain(savedComment);
  }

  async findById(id: string): Promise<CommentEntity | null> {
    const commentDocument = await this.commentModel.findById(id).exec();
    return commentDocument ? this.toDomain(commentDocument) : null;
  }

  async update(comment: CommentEntity): Promise<CommentEntity> {
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(comment.id, this.toSchema(comment), { new: true })
      .exec();
    return this.toDomain(updatedComment);
  }

  async findByTarget(
    targetId: string,
    targetType: 'list' | 'review',
  ): Promise<CommentEntity[]> {
    const commentDocuments = await this.commentModel
      .find({ targetId, targetType })
      .exec();
    return commentDocuments.map((doc) => this.toDomain(doc));
  }

  async findAll(): Promise<CommentEntity[]> {
    const commentDocuments = await this.commentModel.find().exec();
    return commentDocuments.map((doc) => this.toDomain(doc));
  }

  async delete(id: string): Promise<void> {
    await this.commentModel.findByIdAndDelete(id).exec();
  }
}

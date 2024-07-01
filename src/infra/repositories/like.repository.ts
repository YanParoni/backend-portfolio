// src/infra/repositories/like.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeSchema, LikeDocument } from '@/infra/schemas/like.schema';
import { Like as LikeEntity } from '@/domain/entities/like.entity';
import { ILikeRepository } from '@/domain/repositories/like.repository.interface';

@Injectable()
export class LikeRepository implements ILikeRepository {
  constructor(
    @InjectModel(LikeSchema.name) private likeModel: Model<LikeDocument>,
  ) {}

  private toDomain(likeDocument: LikeDocument): LikeEntity {
    return new LikeEntity(
      likeDocument._id.toString(),
      likeDocument.userId,
      likeDocument.targetId,
      likeDocument.targetType,
    );
  }

  private toSchema(like: LikeEntity): Partial<LikeDocument> {
    return {
      userId: like.userId,
      targetId: like.targetId,
      targetType: like.targetType,
    };
  }

  async create(like: LikeEntity): Promise<LikeEntity> {
    const createdLike = new this.likeModel(this.toSchema(like));
    const savedLike = await createdLike.save();
    return this.toDomain(savedLike);
  }

  async delete(id: string): Promise<void> {
    await this.likeModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<LikeEntity[]> {
    const likeDocuments = await this.likeModel.find().exec();
    return likeDocuments.map((doc) => this.toDomain(doc));
  }

  async findByUserIdAndTargetId(
    userId: string,
    targetId: string,
  ): Promise<LikeEntity | null> {
    const likeDocument = await this.likeModel
      .findOne({ userId, targetId })
      .exec();
    return likeDocument ? this.toDomain(likeDocument) : null;
  }

  async findById(id: string): Promise<LikeEntity | null> {
    const likeDocument = await this.likeModel.findById(id).exec();
    return likeDocument ? this.toDomain(likeDocument) : null;
  }
}

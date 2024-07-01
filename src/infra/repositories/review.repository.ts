import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewSchema, ReviewDocument } from '@/infra/schemas/review.schema';
import { Review as ReviewEntity } from '@/domain/entities/review.entity';
import { IReviewRepository } from '@/domain/repositories/review.repository.interface';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectModel(ReviewSchema.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  private toDomain(reviewDocument: ReviewDocument): ReviewEntity {
    return new ReviewEntity(
      reviewDocument._id.toString(),
      reviewDocument.gameTitle,
      reviewDocument.gameReleaseDate,
      reviewDocument.gameImage,
      reviewDocument.reviewDate,
      reviewDocument.content,
      reviewDocument.rating,
      reviewDocument.likes,
      reviewDocument.userName,
      reviewDocument.userProfileImage,
      reviewDocument.userId,
    );
  }

  private toSchema(review: ReviewEntity): Partial<ReviewDocument> {
    return {
      gameTitle: review.gameTitle,
      gameReleaseDate: review.gameReleaseDate,
      gameImage: review.gameImage,
      reviewDate: review.reviewDate,
      content: review.content,
      rating: review.rating,
      likes: review.likes,
      userName: review.userName,
      userProfileImage: review.userProfileImage,
      userId: review.userId,
    };
  }

  async create(review: ReviewEntity): Promise<ReviewEntity> {
    const createdReview = new this.reviewModel(this.toSchema(review));
    const savedReview = await createdReview.save();
    return this.toDomain(savedReview);
  }

  async findAll(): Promise<ReviewEntity[]> {
    const reviewDocuments = await this.reviewModel.find().exec();
    return reviewDocuments.map((doc) => this.toDomain(doc));
  }

  async findByGame(gameTitle: string): Promise<ReviewEntity[]> {
    const reviewDocuments = await this.reviewModel.find({ gameTitle }).exec();
    return reviewDocuments.map((doc) => this.toDomain(doc));
  }

  async findByUser(userName: string): Promise<ReviewEntity[]> {
    const reviewDocuments = await this.reviewModel.find({ userName }).exec();
    return reviewDocuments.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<ReviewEntity | null> {
    const reviewDocument = await this.reviewModel.findById(id).exec();
    return reviewDocument ? this.toDomain(reviewDocument) : null;
  }

  async update(review: ReviewEntity): Promise<ReviewEntity> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(review.id, this.toSchema(review), { new: true })
      .exec();
    return this.toDomain(updatedReview);
  }

  async delete(id: string): Promise<void> {
    await this.reviewModel.findByIdAndDelete(id).exec();
  }
}

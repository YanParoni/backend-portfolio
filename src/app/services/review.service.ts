import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewRepository } from '@/infra/repositories/review.repository';
import { UserRepository } from '@/infra/repositories/user.repository';
import { Review } from '@/domain/entities/review.entity';
import { CreateReviewDto } from '@/app/dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    currentUserId: string,
  ): Promise<Review> {
    const currentUser = await this.userRepository.findById(currentUserId);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const review = new Review(
      null,
      createReviewDto.gameTitle,
      createReviewDto.gameReleaseDate,
      createReviewDto.gameImage,
      createReviewDto.reviewDate,
      createReviewDto.content,
      createReviewDto.rating,
      0,
      currentUser.username,
      currentUser.profileImage,
    );
    return this.reviewRepository.create(review);
  }

  async findAll(currentUserId: string | null): Promise<Review[]> {
    const reviews = await this.reviewRepository.findAll();
    if (currentUserId) {
      const currentUser = await this.userRepository.findById(currentUserId);
      return reviews.filter(
        (review) => !currentUser.blockedUsers.includes(review.userName),
      );
    }
    return reviews;
  }

  async findByGame(
    gameTitle: string,
    currentUserId: string | null,
  ): Promise<Review[]> {
    const reviews = await this.reviewRepository.findByGame(gameTitle);
    if (currentUserId) {
      const currentUser = await this.userRepository.findById(currentUserId);
      return reviews.filter(
        (review) => !currentUser.blockedUsers.includes(review.userName),
      );
    }
    return reviews;
  }

  async findByUser(
    userName: string,
    currentUserId: string | null,
  ): Promise<Review[]> {
    const reviews = await this.reviewRepository.findByUser(userName);
    if (currentUserId) {
      const currentUser = await this.userRepository.findById(currentUserId);
      return reviews.filter(
        (review) => !currentUser.blockedUsers.includes(review.userName),
      );
    }
    return reviews;
  }

  async deleteReview(reviewId: string, currentUserId: string): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.userName !== currentUserId) {
      throw new ForbiddenException('You cannot delete this review');
    }
    await this.reviewRepository.delete(reviewId);
  }
}

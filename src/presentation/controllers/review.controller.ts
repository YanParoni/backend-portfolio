import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from '@/app/services/review.service';
import { CreateReviewDto } from '@/app/dto/create-review.dto';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(
    @Req() req: AuthenticatedRequest,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(createReviewDto, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticated')
  async findAllAuthenticated(@Req() req: AuthenticatedRequest) {
    console.log(req.user._id);
    return this.reviewService.findAll(req.user._id);
  }

  @Get('game/:gameTitle')
  async findByGame(@Param('gameTitle') gameTitle: string, @Req() req: Request) {
    const userId = req.headers['user-id'] || null;
    return this.reviewService.findByGame(gameTitle, userId);
  }

  @Get('user/:userName')
  async findByUser(@Param('userName') userName: string, @Req() req: Request) {
    const currentUserId = req.headers['user-id'] || null;
    return this.reviewService.findByUser(userName, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReview(
    @Param('id') reviewId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewService.deleteReview(reviewId, req.user.username);
  }
}

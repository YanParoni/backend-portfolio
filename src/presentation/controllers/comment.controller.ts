import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from '@/app/services/comment.service';
import { CreateCommentDto } from '@/app/dto/create-comment.dto';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Req() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(
      createCommentDto,
      req.user._id,
      req.user.username,
      req.user.profileImage,
    );
  }

  @Get('review/:reviewId')
  async findByReview(@Param('reviewId') reviewId: string) {
    return this.commentService.findByTarget(reviewId, 'review');
  }

  @Get('list/:listId')
  async findByList(@Param('listId') listId: string) {
    return this.commentService.findByTarget(listId, 'list');
  }
}

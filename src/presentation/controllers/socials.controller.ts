import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SocialService } from '@/app/services/socials.service';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('social')
export class SocialsController {
  constructor(private readonly socialService: SocialService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow/:id')
  async followUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userIdToFollow: string,
  ) {
    await this.socialService.followUser(req.user.sub, userIdToFollow);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfollow/:id')
  async unfollowUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userIdToUnfollow: string,
  ) {
    await this.socialService.unfollowUser(req.user.sub, userIdToUnfollow);
  }

  @UseGuards(JwtAuthGuard)
  @Post('block/:id')
  async blockUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userIdToBlock: string,
  ) {
    await this.socialService.blockUser(req.user.sub, userIdToBlock);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unblock/:id')
  async unblockUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userIdToUnblock: string,
  ) {
    await this.socialService.unblockUser(req.user.sub, userIdToUnblock);
  }

  @UseGuards(JwtAuthGuard)
  @Post('block-comment/:id')
  async blockComment(
    @Req() req: AuthenticatedRequest,
    @Param('id') commentId: string,
  ) {
    await this.socialService.blockComment(req.user.sub, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unblock-comment/:id')
  async unblockComment(
    @Req() req: AuthenticatedRequest,
    @Param('id') commentId: string,
  ) {
    await this.socialService.unblockComment(req.user.sub, commentId);
  }
}

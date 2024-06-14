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
    await this.socialService.followUser(req.user._id, userIdToFollow);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfollow/:id')
  async unfollowUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userIdToUnfollow: string,
  ) {
    await this.socialService.unfollowUser(req.user._id, userIdToUnfollow);
  }

  @UseGuards(JwtAuthGuard)
  @Post('block/:id')
  async blockUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userIdToBlock: string,
  ) {
    await this.socialService.blockUser(req.user._id, userIdToBlock);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unblock/:id')
  async unblockUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userIdToUnblock: string,
  ) {
    await this.socialService.unblockUser(req.user._id, userIdToUnblock);
  }
}

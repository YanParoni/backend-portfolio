import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { FollowUserDto } from './dto/follow-user.dto';
import { UnfollowUserDto } from './dto/unfollow-user.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow')
  async followUser(@Req() req: Request, @Body() followUserDto: FollowUserDto) {
    const userId = (req.user as any).userId;
    await this.socialService.followUser(userId, followUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfollow')
  async unfollowUser(
    @Req() req: Request,
    @Body() unfollowUserDto: UnfollowUserDto,
  ) {
    const userId = (req.user as any).userId;
    await this.socialService.unfollowUser(userId, unfollowUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('block')
  async blockUser(@Req() req: Request, @Body() blockUserDto: BlockUserDto) {
    const userId = (req.user as any).userId;
    await this.socialService.blockUser(userId, blockUserDto);
  }
}

import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UserService } from '@/app/services/user.service';
import { CreateUserDto } from '@/app/dto/create-user.dto';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { BlockedGuard } from '@/infra/guards/blocked.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile-image')
  async updateProfileImage(
    @Request() req: AuthenticatedRequest,
    @Body('base64Image') base64Image: string,
  ) {
    return this.userService.updateProfileImage(req.user._id, base64Image);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bio')
  async updateBio(
    @Request() req: AuthenticatedRequest,
    @Body('newBio') newBio: string,
  ) {
    return this.userService.updateBio(req.user._id, newBio);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('at')
  async updateAt(
    @Request() req: AuthenticatedRequest,
    @Body('newAt') newAt: string,
  ) {
    return this.userService.updateAt(req.user._id, newAt);
  }

  @UseGuards(JwtAuthGuard, BlockedGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.userService.findById(id);
  }
}

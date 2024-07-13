import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from '@/app/services/user.service';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from '@/app/dto/create-user.dto';
import { BlockedGuard } from '@/infra/guards/blocked.guard';

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
    return this.userService.updateProfileImage(req.user.sub, base64Image);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('header-image')
  async updateHeaderImage(
    @Request() req: AuthenticatedRequest,
    @Body('base64Image') base64Image: string,
  ) {
    return this.userService.updateHeaderImage(req.user.sub, base64Image);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bio')
  async updateBio(
    @Request() req: AuthenticatedRequest,
    @Body('newBio') newBio: string,
  ) {
    return this.userService.updateBio(req.user.sub, newBio);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('at')
  async updateAt(
    @Request() req: AuthenticatedRequest,
    @Body('newAt') newAt: string,
  ) {
    return this.userService.updateAt(req.user.sub, newAt);
  }

  @UseGuards(JwtAuthGuard, BlockedGuard)
  @Get('profile/:id')
  getProfile(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.userService.findById(id);
  }
}

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

  @UseGuards(JwtAuthGuard, BlockedGuard)
  @Get('profile/:id')
  getProfile(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.userService.findById(id);
  }
}

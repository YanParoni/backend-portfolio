import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from '@/app/services/user.service';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';
import { CreateUserDto } from '@/app/dto/create-user.dto';
import { BlockedGuard } from '@/infra/guards/blocked.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile-image')
  @ApiOperation({ summary: 'Update profile image' })
  async updateProfileImage(
    @Request() req: AuthenticatedRequest,
    @Body('base64Image') base64Image: string,
  ) {
    return this.userService.updateProfileImage(req.user.sub, base64Image);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('header-image')
  @ApiOperation({ summary: 'Update header image' })
  async updateHeaderImage(
    @Request() req: AuthenticatedRequest,
    @Body('base64Image') base64Image: string,
  ) {
    return this.userService.updateHeaderImage(req.user.sub, base64Image);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('bio')
  @ApiOperation({ summary: 'Update bio' })
  async updateBio(
    @Request() req: AuthenticatedRequest,
    @Body('newBio') newBio: string,
  ) {
    return this.userService.updateBio(req.user.sub, newBio);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('at')
  @ApiOperation({ summary: 'Update @ handle' })
  async updateAt(
    @Request() req: AuthenticatedRequest,
    @Body('newAt') newAt: string,
  ) {
    return this.userService.updateAt(req.user.sub, newAt);
  }

  @UseGuards(JwtAuthGuard, BlockedGuard)
  @ApiBearerAuth()
  @Get('profile/:id')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  getProfile(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.userService.findById(id);
  }
}

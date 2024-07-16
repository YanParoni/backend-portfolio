import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthService } from '@/app/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { LoginUserDto } from '@/app/dto/login-user.dto';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ResetPasswordRequestDto } from '@/app/dto/reset-password-request.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.authService.login(loginUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth login' })
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = req.user.jwt;
    const redirect = process.env.FRONTEND;
    res.redirect(`${redirect}/auth/success?token=${token}`);
    return { token };
  }

  @Get('validate-token')
  @ApiOperation({ summary: 'Validate JWT token' })
  async validateToken(@Query('token') token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, message: 'Invalid or expired token' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const userProfile = await this.authService.getUserProfile(userId);
    return userProfile;
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    const user = await this.authService.getUserFromToken(token);
    if (user.oauth) {
      return {
        message:
          'OAuth users cannot reset their password through this service.Log in with continue with google',
      };
    }
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password reset successfully' };
  }

  @Post('reset-password-request')
  @ApiOperation({ summary: 'Request password reset' })
  async requestPasswordReset(
    @Body() requestPasswordReset: ResetPasswordRequestDto,
  ) {
    const { email } = requestPasswordReset;
    const user = await this.authService.findUserByEmail(email);
    if (user.oauth) {
      return {
        message:
          'OAuth users cannot reset their password through this service. You need to be logged in.',
        success: false,
      };
    }
    await this.authService.requestPasswordReset(email);
    return {
      message: 'Password reset email sent successfully',
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    const user = req.user;
    await this.authService.changePassword(
      user.sub,
      newPassword,
      currentPassword,
    );
    return { message: 'Password changed successfully' };
  }
}

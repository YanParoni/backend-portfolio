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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.authService.login(loginUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = req.user.jwt;
    res.redirect(`http://localhost:3001/auth/success?token=${token}`);
    return { token };
  }

  @Get('validate-token')
  async validateToken(@Query('token') token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, message: 'Invalid or expired token' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const userProfile = await this.authService.getUserProfile(userId);
    return userProfile;
  }

  @Post('reset-password-request')
  async requestPasswordReset(@Body('email') email: string) {
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

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
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

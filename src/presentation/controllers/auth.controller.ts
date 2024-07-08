import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  Query,
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log('authed', req);
  }

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
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginUserDto);
  }

  @Post('reset-password-request')
  async requestPasswordReset(@Body('email') email: string) {
    await this.authService.requestPasswordReset(email);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password reset successfully' };
  }
}

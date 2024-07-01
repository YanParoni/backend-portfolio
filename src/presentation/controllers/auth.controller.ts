import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from '@/app/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { ResetPasswordDto } from '@/app/dto/reset-password.dto';
import { LoginUserDto } from '@/app/dto/login-user.dto';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log('authed', req);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const jwt = req.user.jwt;
    res.redirect(`http://localhost:3001/auth/success?token=${jwt}`);
    return { jwt };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginUserDto);
  }
}

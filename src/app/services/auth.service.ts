import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/app/services/user.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { LoginUserDto } from '@/app/dto/login-user.dto';
import { EmailService } from '@/app/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findByUsername(loginUserDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatching = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      username: user.username,
      sub: user.id,
      profileImage: user?.profileImage || '',
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = this.jwtService.sign(
      { userId: user.id, name: user.username },
      { expiresIn: '1h' },
    );
    const resetLink = `http://localhost:3001/user/reset-password?token=${token}`;
    await this.emailService.sendMail(
      email,
      'Password Reset Request',
      `Please click the link to reset your password: ${resetLink}`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const decoded = this.jwtService.verify(token);
    const userId = decoded.userId;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  async validateOAuthLogin(profile: any): Promise<string> {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('No email found in Google profile');
    }

    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.createOAuthUser(profile);
    }
    const payload = {
      username: user.username,
      sub: user.id,
      profileImage: user.profileImage,
    };
    return this.jwtService.sign(payload);
  }
}

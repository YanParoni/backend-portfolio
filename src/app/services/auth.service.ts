import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@/infra/repositories/user.repository';
import { LoginUserDto } from '@/app/dto/login-user.dto';
import { EmailService } from '@/app/services/email.service';
import { User } from '@/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByUsername(username);
    if (user && !user.oauth && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (await this.isLoginAllowed(user, loginUserDto.password)) {
      return this.generateAccessToken(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = this.jwtService.sign(
      { userId: user.id, name: user.username },
      { expiresIn: '1h' },
    );
    const resetLink = `https://design-template-ivory.vercel.app/user/reset-password?token=${token}`;
    await this.emailService.sendMail(email, user.username, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const decoded = this.jwtService.verify(token);
    const userId = decoded.userId;
    const user = await this.userRepository.findById(userId);
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
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.createOAuthUser(profile);
    }
    const payload = {
      username: user.username,
      sub: user.id,
      oauth: true,
      needsPasswordSetup: !user.password,
      bio: user.bio,
    };
    return this.jwtService.sign(payload);
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserFromToken(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token);
    const user = await this.userRepository.findById(decoded.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async changePassword(
    userId: string,
    newPassword: string,
    currentPassword?: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.oauth && !user.password) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updatePassword(userId, hashedPassword);
      return { message: 'Password set successfully for OAuth user' };
    }

    if (currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
    return { message: 'Password changed successfully' };
  }

  private async isLoginAllowed(
    user: User,
    providedPassword: string,
  ): Promise<boolean> {
    if (user.oauth && !user.password) {
      return true;
    }
    return await bcrypt.compare(providedPassword, user.password);
  }

  private generateAccessToken(user: User): { token: string } {
    const payload = {
      username: user.username,
      sub: user.id,
      oauth: user.oauth,
      needsPasswordSetup: user.oauth && !user.password,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}

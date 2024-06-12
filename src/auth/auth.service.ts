import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
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
    const payload = { username: user.username, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateOAuthLogin(profile: any): Promise<string> {
    let user = await this.usersService.findOneByEmail(profile.email);
    if (!user) {
      user = await this.usersService.createOAuthUser(profile);
    }
    const payload = { username: user.username, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.usersService.findOneByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      salt,
    );
    user.password = hashedPassword;
    await this.usersService.updateUser(user);
  }
}

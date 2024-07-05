import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/app/services/user.service';
import { UserRepository } from '@/infra/repositories/user.repository';
import { LoginUserDto } from '@/app/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
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
    const user = await this.userService.findByEmail(loginUserDto.username);
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
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
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

    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}

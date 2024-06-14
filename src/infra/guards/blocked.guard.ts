import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRepository } from '@/infra/repositories/user.repository';

@Injectable()
export class BlockedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    if (!user) {
      return false;
    }

    const currentUser = await this.userRepository.findById(user._id);
    const targetUser = await this.userRepository.findById(params.id);

    if (!currentUser || !targetUser) {
      throw new ForbiddenException('User not found');
    }

    if (
      currentUser.blockedUsers.includes(targetUser.id) ||
      targetUser.blockedUsers.includes(currentUser.id)
    ) {
      throw new ForbiddenException('You are blocked from accessing this user');
    }

    return true;
  }
}

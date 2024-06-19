import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from '@/infra/repositories/user.repository';
import { CommentRepository } from '@/infra/repositories/comment.repository';

@Injectable()
export class SocialService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async followUser(
    currentUserId: string,
    userIdToFollow: string,
  ): Promise<void> {
    const currentUser = await this.userRepository.findById(currentUserId);
    const userToFollow = await this.userRepository.findById(userIdToFollow);

    if (!currentUser || !userToFollow) {
      throw new NotFoundException('User not found');
    }

    if (currentUser.isBlocked(userIdToFollow)) {
      throw new ForbiddenException('You cannot follow a user you have blocked');
    }

    currentUser.follow(userIdToFollow);
    userToFollow.addFollower(currentUserId);

    await this.userRepository.update(currentUser);
    await this.userRepository.update(userToFollow);
  }

  async unfollowUser(
    currentUserId: string,
    userIdToUnfollow: string,
  ): Promise<void> {
    const currentUser = await this.userRepository.findById(currentUserId);
    const userToUnfollow = await this.userRepository.findById(userIdToUnfollow);

    if (!currentUser || !userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    currentUser.unfollow(userIdToUnfollow);
    userToUnfollow.removeFollower(currentUserId);

    await this.userRepository.update(currentUser);
    await this.userRepository.update(userToUnfollow);
  }

  async blockUser(currentUserId: string, userIdToBlock: string): Promise<void> {
    const currentUser = await this.userRepository.findById(currentUserId);
    const userToBlock = await this.userRepository.findById(userIdToBlock);

    if (!currentUser || !userToBlock) {
      throw new NotFoundException('User not found');
    }

    currentUser.blockUser(userIdToBlock);

    await this.userRepository.update(currentUser);
  }

  async unblockUser(
    currentUserId: string,
    userIdToUnblock: string,
  ): Promise<void> {
    const currentUser = await this.userRepository.findById(currentUserId);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    currentUser.unblockUser(userIdToUnblock);

    await this.userRepository.update(currentUser);
  }

  async blockComment(currentUserId: string, commentId: string): Promise<void> {
    const currentUser = await this.userRepository.findById(currentUserId);
    const comment = await this.commentRepository.findById(commentId);

    if (!currentUser || !comment) {
      throw new NotFoundException('Comment or User not found');
    }

    if (comment.authorId === currentUserId) {
      throw new ForbiddenException('You cannot block your own comment');
    }

    comment.block();

    await this.commentRepository.update(comment);
  }

  async unblockComment(
    currentUserId: string,
    commentId: string,
  ): Promise<void> {
    const currentUser = await this.userRepository.findById(currentUserId);
    const comment = await this.commentRepository.findById(commentId);

    if (!currentUser || !comment) {
      throw new NotFoundException('Comment or User not found');
    }

    comment.unblock();

    await this.commentRepository.update(comment);
  }
}

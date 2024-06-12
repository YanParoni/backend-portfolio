import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { FollowUserDto } from './dto/follow-user.dto';
import { UnfollowUserDto } from './dto/unfollow-user.dto';
import { BlockUserDto } from './dto/block-user.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async followUser(
    userId: string,
    followUserDto: FollowUserDto,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    const userToFollow = await this.userModel.findById(
      followUserDto.userIdToFollow,
    );

    if (!user || !userToFollow) {
      throw new NotFoundException('User not found');
    }

    const follow = new this.followModel({
      follower: new Types.ObjectId(userId),
      following: new Types.ObjectId(followUserDto.userIdToFollow),
    });

    await follow.save();

    user.following.push(userToFollow._id);
    userToFollow.followers.push(user._id);

    await user.save();
    await userToFollow.save();
  }

  async unfollowUser(
    userId: string,
    unfollowUserDto: UnfollowUserDto,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    const userToUnfollow = await this.userModel.findById(
      unfollowUserDto.userIdToUnfollow,
    );

    if (!user || !userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    await this.followModel.findOneAndDelete({
      follower: new Types.ObjectId(userId),
      following: new Types.ObjectId(unfollowUserDto.userIdToUnfollow),
    });

    user.following = user.following.filter(
      (id) => !id.equals(userToUnfollow._id),
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(user._id),
    );

    await user.save();
    await userToUnfollow.save();
  }

  async blockUser(userId: string, blockUserDto: BlockUserDto): Promise<void> {
    const user = await this.userModel.findById(userId);
    const userToBlock = await this.userModel.findById(
      blockUserDto.userIdToBlock,
    );

    if (!user || !userToBlock) {
      throw new NotFoundException('User not found');
    }

    user.blockedUsers.push(userToBlock._id);
    await user.save();
  }
}

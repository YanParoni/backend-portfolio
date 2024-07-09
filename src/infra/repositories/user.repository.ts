import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchema, UserDocument } from '@/infra/schemas/user.schema';
import { User as UserEntity } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
  ) {}

  private toDomain(userDocument: UserDocument): UserEntity {
    return new UserEntity(
      userDocument._id.toString(),
      userDocument.username,
      userDocument.at,
      userDocument.email,
      userDocument.password,
      userDocument.profileImage,
      userDocument.bio,
      userDocument.isPrivate,
      userDocument.followers,
      userDocument.following,
      userDocument.blockedUsers,
      userDocument.reviews,
      userDocument.likes,
      userDocument.gameInteractions,
      false,
    );
  }

  private toSchema(user: UserEntity): Partial<UserDocument> {
    return {
      username: user.username,
      at: user.at,
      email: user.email,
      password: user.password,
      profileImage: user.profileImage,
      bio: user.bio,
      isPrivate: user.isPrivate,
      followers: user.followers,
      following: user.following,
      blockedUsers: user.blockedUsers,
      reviews: user.reviews,
      likes: user.likes,
      gameInteractions: user.gameInteractions,
    };
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel(this.toSchema(user));
    const savedUser = await createdUser.save();
    return this.toDomain(savedUser);
  }

  async findAll(): Promise<UserEntity[]> {
    const userDocuments = await this.userModel.find().exec();
    return userDocuments.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const userDocument = await this.userModel.findById(id).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userDocument = await this.userModel.findOne({ email }).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const userDocument = await this.userModel.findOne({ username }).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(user.id, this.toSchema(user), { new: true })
      .exec();
    return this.toDomain(updatedUser);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { password: hashedPassword })
      .exec();
  }
  async addGameInteraction(
    userId: string,
    interactionId: string,
  ): Promise<void> {
    await this.userModel
      .updateOne(
        { _id: userId },
        { $push: { gameInteractions: interactionId } },
      )
      .exec();
  }

  async removeGameInteraction(
    userId: string,
    interactionId: string,
  ): Promise<void> {
    await this.userModel
      .updateOne(
        { _id: userId },
        { $pull: { gameInteractions: interactionId } },
      )
      .exec();
  }
}

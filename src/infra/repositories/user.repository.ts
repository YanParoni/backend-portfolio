import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
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
      userDocument.email,
      userDocument.password,
      userDocument.profileImage,
      userDocument.bio,
      userDocument.isPrivate,
      userDocument.followers.map((f) => f.toString()),
      userDocument.following.map((f) => f.toString()),
      userDocument.blockedUsers.map((b) => b.toString()),
      userDocument.favorites.map((f) => f.toString()),
      userDocument.reviews.map((r) => r.toString()),
      userDocument.likes.map((l) => l.toString()),
    );
  }

  private toSchema(user: UserEntity): Partial<UserDocument> {
    return {
      username: user.username,
      email: user.email,
      password: user.password,
      profileImage: user.profileImage,
      bio: user.bio,
      isPrivate: user.isPrivate,
      followers: user.followers.map(
        (f) => new MongooseSchema.Types.ObjectId(f),
      ),
      following: user.following.map(
        (f) => new MongooseSchema.Types.ObjectId(f),
      ),
      blockedUsers: user.blockedUsers.map(
        (b) => new MongooseSchema.Types.ObjectId(b),
      ),
      favorites: user.favorites.map(
        (f) => new MongooseSchema.Types.ObjectId(f),
      ),
      reviews: user.reviews.map((r) => new MongooseSchema.Types.ObjectId(r)),
      likes: user.likes.map((l) => new MongooseSchema.Types.ObjectId(l)),
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

  async createOAuthUser(profile: any): Promise<UserEntity> {
    const createdUser = new this.userModel({
      username: profile.firstName,
      email: profile.email,
      password: null,
      favorites: [],
      reviews: [],
      likes: [],
    });
    const savedUser = await createdUser.save();
    return this.toDomain(savedUser);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Review, User as UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private toUserInterface(user: UserDocument): UserInterface {
    const userObject = user.toObject();
    return {
      _id: userObject._id.toString(),
      username: userObject.username,
      email: userObject.email,
      password: userObject.password,
      favorites: userObject.favorites.map((id: any) =>
        id.toString(),
      ) as string[],
      reviews: userObject.reviews.map((review: any) => ({
        ...review,
        gameId: review.gameId.toString(),
        date: new Date(review.date),
      })) as Review[],
      likes: userObject.likes.map((id: any) => id.toString()) as string[],
    } as UserInterface;
  }

  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await createdUser.save();
    return this.toUserInterface(savedUser);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async createOAuthUser(profile: any): Promise<UserDocument> {
    const createdUser = new this.userModel({
      username: profile.firstName,
      email: profile.email,
      password: null,
      favorites: [],
      reviews: [],
      likes: [],
    });
    return createdUser.save();
  }

  async updateProfileImage(
    userId: string,
    base64Image: string,
  ): Promise<UserInterface> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    user.profileImage = base64Image;
    const updatedUser = await user.save();
    return this.toUserInterface(updatedUser);
  }

  async updateUser(user: UserDocument): Promise<UserInterface> {
    const updatedUser = await user.save();
    return this.toUserInterface(updatedUser);
  }
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UnfollowUserDto {
  @IsNotEmpty()
  @IsString()
  userIdToUnfollow: string;
}

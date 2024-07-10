import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeAvatarDto {
  @IsString()
  @IsNotEmpty()
  avatarUrl: string;
}

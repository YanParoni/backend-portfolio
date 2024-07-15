import { IsString } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsString()
  email: string;
}

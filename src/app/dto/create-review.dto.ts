import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  gameTitle: string;

  @IsNotEmpty()
  @IsString()
  gameReleaseDate: string;

  @IsNotEmpty()
  @IsString()
  gameImage: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  reviewDate: string;
}

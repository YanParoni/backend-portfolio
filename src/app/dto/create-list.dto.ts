import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  games: string[];
}

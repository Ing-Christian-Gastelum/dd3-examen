import { IsNotEmpty, Length } from 'class-validator';

export class PostWordDto {
  @IsNotEmpty()
  @Length(5, 5)
  user_word: string;
}

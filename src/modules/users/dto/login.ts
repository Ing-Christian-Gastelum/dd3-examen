import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(5, 16)
  username: string;

  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}

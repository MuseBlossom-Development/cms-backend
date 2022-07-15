import { IsAlphanumeric, IsEmail, Length } from 'class-validator';

export class SignOutDTO {
  @IsAlphanumeric()
  user_id: string;

  @Length(8, 20)
  @IsAlphanumeric()
  password: string;

  @IsAlphanumeric()
  passwordCheck: string;

  @IsAlphanumeric()
  company_name: string;

  @IsEmail()
  email: string;
}

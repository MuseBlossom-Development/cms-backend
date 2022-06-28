import { IsAlphanumeric, IsBoolean, IsEmail, Length } from 'class-validator';

export class SignOut {
  @IsAlphanumeric()
  user_id: string;

  @Length(11, 20)
  @IsAlphanumeric()
  password: string;

  @IsAlphanumeric()
  passwordCheck: string;

  @IsAlphanumeric()
  company_name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  idCheck?: boolean;
}

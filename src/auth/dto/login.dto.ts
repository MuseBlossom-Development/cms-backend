import { IsAlphanumeric } from 'class-validator';

export class LoginDTO {
  @IsAlphanumeric()
  id: string;

  @IsAlphanumeric()
  password: string;
}

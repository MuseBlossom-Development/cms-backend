import { IsAlphanumeric } from 'class-validator';

export class TokenCheckDTO {
  @IsAlphanumeric()
  accessToken: string;

  @IsAlphanumeric()
  refreshToken: string;
}

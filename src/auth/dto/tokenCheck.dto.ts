import { IsAlphanumeric } from 'class-validator';

export class TokenCheckDTO {
  @IsAlphanumeric()
  accesstoken: string;

  @IsAlphanumeric()
  refreshtoken: string;
}

import { IsEmail, IsNumber, IsString } from 'class-validator';

export class HelpDTO {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  info: string;

  @IsString()
  contents: string;
}

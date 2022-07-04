import { IsAlpha, IsAlphanumeric, IsNumber, IsString } from 'class-validator';
import { Users } from 'src/entities/Users.entity';

export class ContractInfoDTO {
  user_id: Users;

  @IsString()
  business_number: string;

  @IsAlpha()
  manager: string;

  @IsString()
  business_size: string;

  @IsString()
  business_type: string;

  @IsString()
  contact_info: string;

  document: string;
}

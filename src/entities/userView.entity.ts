import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Users } from './Users.entity';
import { UserInfo } from './userinfo.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('', 'id')
      .addSelect('', '')
      .addSelect('', '')
      .addSelect('', '')
      .addSelect('', '')
      .from(Users, 'u')
      .leftJoin(UserInfo, 'info', 'user.user_id = info.user'),
})
export class UserView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  tier: number;

  @ViewColumn()
  manager: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  contact_info: string;

  @ViewColumn()
  subscription: Date;

  @ViewColumn()
  company_name: string;

  @ViewColumn()
  business_number: string;

  @ViewColumn()
  business_type: string;
}

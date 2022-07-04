import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Users } from './Users.entity';
import { UserInfo } from './userinfo.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('u.user_id', 'id')
      .addSelect('info.business_number', 'business_number')
      .addSelect('u.company_name', 'company_name')
      .addSelect('u.tier', 'tier')
      .addSelect('info.manager', 'manager')
      .addSelect('u.email', 'email')
      .addSelect('info.contact_info', 'contact_info')
      .addSelect('u.subscription', 'subscription')
      .addSelect('u.create_at', 'create_at')
      .from(UserInfo, 'info')
      .leftJoin(Users, 'u', 'u.user_id = info.user_id'),
})
export class UserView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  business_number: string;

  @ViewColumn()
  company_name: string;

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
  create_at: Date;
}

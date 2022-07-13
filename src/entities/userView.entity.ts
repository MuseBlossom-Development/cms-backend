import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Users } from './users.entity';
import { UserInfo } from './userinfo.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('info.business_number', 'com_num')
      .addSelect('u.company_name', 'com_name')
      .addSelect('u.email', 'email')
      .addSelect('u.tier', 'tier')
      .addSelect('u.create_at', 'create_at')
      .addSelect('u.subscription', 'subscription')
      .from(Users, 'u')
      .leftJoin(UserInfo, 'info', 'u.userInfo = info.info_id'),
})
export class UserView {
  @ViewColumn()
  com_num: string;

  @ViewColumn()
  com_name: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  create_at: Date;

  @ViewColumn()
  tier: number;

  @ViewColumn()
  subscription: Date;
}

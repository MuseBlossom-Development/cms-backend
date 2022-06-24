import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Downloads } from './downloads.entity';
import { Notice } from './notice.entity';
import { UserInfo } from './userinfo.entity';
import { Wait } from './wait.entity';

@Entity()
@Index(['user_id', 'email'], { unique: true })
export class Users {
  @PrimaryColumn()
  user_id: string;

  @Column()
  password: string;

  @Column()
  tier: number;

  @Column()
  company_name: string;

  @Column()
  email: string;

  @Column()
  subscription: Date;

  @CreateDateColumn()
  create_at: Date;

  @OneToOne(() => UserInfo, (info) => info.user, { nullable: true })
  @JoinColumn()
  userinfo: UserInfo;

  @OneToMany(() => Notice, (notice) => notice.user_id)
  notice: Notice[];

  @OneToMany(() => Wait, (wait) => wait.user_id)
  wait: Wait[];

  @OneToMany(() => Downloads, (down) => down.user_id)
  down: Downloads[];
}

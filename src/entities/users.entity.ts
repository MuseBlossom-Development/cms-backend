import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Downloads } from './downloads.entity';
import { Notice } from './notice.entity';
import { createHmac } from 'crypto';
import { UserInfo } from './userinfo.entity';

@Entity()
@Index(['user_id', 'email'], { unique: true })
export class Users {
  @PrimaryColumn()
  user_id: string;

  @Column({ type: 'varchar', length: 70 })
  password: string;

  @Column({ default: 0 })
  tier?: number;

  @Column()
  company_name: string;

  @Column()
  email: string;

  @Column({ default: false })
  isEmail: boolean;

  @Column({ default: null })
  subscription?: Date;

  @CreateDateColumn()
  create_at?: Date;

  @BeforeInsert()
  async setPassword(password: string) {
    this.password = createHmac('sha256', process.env.PW_SECRET_KEY)
      .update(password || this.password)
      .digest('hex');
  }

  @OneToMany(() => Notice, (notice) => notice.user)
  notice: Notice[];

  @OneToMany(() => Downloads, (download) => download.user)
  download: Downloads[];

  @OneToOne(() => UserInfo)
  @JoinColumn()
  userInfo: UserInfo;
}

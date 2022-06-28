import {
  BeforeInsert,
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
import * as bcrypt from 'bcrypt';

@Entity()
@Index(['user_id', 'email'], { unique: true })
export class Users {
  @PrimaryColumn()
  user_id: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  tier?: number;

  @Column()
  company_name: string;

  @Column()
  email: string;

  @Column({ default: null })
  subscription?: Date;

  @CreateDateColumn()
  create_at?: Date;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }

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

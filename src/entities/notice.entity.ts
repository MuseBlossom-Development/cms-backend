import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users.entity';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  notice_no: number;

  @ManyToOne(() => Users, (user) => user.notice)
  @JoinColumn()
  user_id: Users;

  @Column()
  notice_key: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  create_at: Date;
}

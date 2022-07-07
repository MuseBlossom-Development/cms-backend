import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  notice_no: number;

  @ManyToOne((type) => Users, (user) => user.notice)
  user: Users;

  @Column()
  notice_key: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  create_at: Date;
}

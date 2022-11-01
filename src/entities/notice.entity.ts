import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  notice_no: number;

  @ManyToOne(() => Users, (user) => user.notice)
  user: Users;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  create_at: Date;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Files } from './files.entity';
import { Users } from './users.entity';

@Entity()
export class Wait {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  wait_no: number;

  @OneToOne(() => Users, (user) => user.user_id)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Files, (file) => file.wait)
  file_id: Files;

  @Column()
  path: string;
}

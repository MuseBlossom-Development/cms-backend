import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Files } from './files.entity';
import { Users } from './Users.entity';

@Entity()
export class Wait {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  wait_no: number;

  @OneToOne(() => Users, (user) => user.wait)
  @JoinColumn()
  user_id: Users;

  @ManyToOne(() => Files, (file) => file.wait)
  @JoinColumn()
  file_id: Files[];
}

import {
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

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Files, (file) => file.wait)
  file_id: Files[];
}

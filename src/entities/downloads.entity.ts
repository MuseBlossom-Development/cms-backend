import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Files } from './files.entity';
import { Users } from './users.entity';

@Entity()
export class Downloads {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  d_id: number;

  @ManyToOne(() => Users, (user) => user.user_id)
  user: Users;

  @ManyToOne(() => Files, (file) => file.file_id)
  file_id: Files;

  @CreateDateColumn()
  download_date: Date;
}

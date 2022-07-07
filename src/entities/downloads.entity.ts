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

  @ManyToOne(() => Users, (user) => user.download)
  user: Users;

  @ManyToOne(() => Files, (file) => file.down)
  file_id: number;

  @CreateDateColumn()
  download_date: Date;
}

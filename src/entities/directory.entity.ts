import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Files } from './files.entity';

@Entity()
export class Directory {
  @OneToMany(() => Directory, (dir) => dir.top_dir_id)
  @PrimaryGeneratedColumn()
  directory_id: Directory[];

  @ManyToOne(() => Directory, (dir) => dir.directory_id)
  top_dir_id: Directory;

  @Column()
  title: string;

  @CreateDateColumn()
  create_at: Date;

  @OneToMany(() => Files, (file) => file.directory_id)
  file: Files[];
}

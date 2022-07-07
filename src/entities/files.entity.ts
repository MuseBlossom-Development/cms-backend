import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Directory } from './directory.entity';
import { Downloads } from './downloads.entity';
import { Wait } from './wait.entity';

@Entity()
export class Files {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  file_id: number;

  @ManyToOne(() => Directory, (directory) => directory.file)
  @JoinColumn()
  directory_id: Directory;

  @Column()
  title: string;

  @Column()
  file_url: string;

  @Column()
  writer: string;

  @Column()
  release_date: Date;

  @Column()
  file_type: string;

  @Column({ default: null })
  purpose: string;

  @Column({ default: null })
  mood: string;

  @Column({ default: null })
  genre: string;

  @Column({ default: null })
  category1: string;

  @Column({ default: null })
  category2: string;

  @Column({ default: null })
  category3: string;

  @CreateDateColumn()
  create_at: Date;

  @ManyToOne(() => Wait, (wait) => wait.file_id)
  wait: Wait;

  @OneToMany(() => Downloads, (down) => down.file_id)
  down: Downloads;
}

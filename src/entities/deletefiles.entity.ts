import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['file_id'], { unique: true })
export class DeleteFiles {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  delete_id: number;

  @Column()
  file_id: number;

  @Column()
  directory_id: string;

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

  @Column()
  purpose: string;

  @Column()
  mood: string;

  @Column()
  genre: string;

  @Column()
  category1: string;

  @Column()
  category2: string;

  @Column()
  category3: string;

  @CreateDateColumn()
  create_at: Date;
}

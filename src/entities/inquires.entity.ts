import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['res_com'], { unique: false })
export class Inquires {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  inq_no: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  contact_info: string;

  @Column()
  content: string;

  @Column({ default: false })
  res_com: boolean;

  @CreateDateColumn()
  create_at: Date;
}

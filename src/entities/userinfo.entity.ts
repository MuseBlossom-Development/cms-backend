import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  info_id: number;

  @OneToOne(() => Users)
  @JoinColumn()
  user_id: Users;

  @Column()
  manager: string;

  @Column()
  business_number: string;

  @Column()
  business_size: string;

  @Column()
  business_type: string;

  @Column()
  contact_info: string;

  @Column()
  document: string;
}

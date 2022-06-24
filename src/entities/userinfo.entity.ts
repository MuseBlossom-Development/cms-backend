import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './Users.entity';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  info_id: number;

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

  @OneToOne(() => Users, (user) => user.user_id)
  user: Users;
}

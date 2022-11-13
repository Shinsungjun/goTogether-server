import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UserDeleteReason')
export class UserDeleteReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'ACTIVE' })
  status: string;
}

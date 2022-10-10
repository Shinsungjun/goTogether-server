import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 13 })
  phoneNumber: string;

  // 아이디
  @Column({ length: 15 })
  userName: string;

  @Column({ length: 20 })
  password: string;

  @Column({ length: 10 })
  nickName: string;

  @Column({ type: 'date' })
  privacyAcceptedAt: string;

  @Column({ length: 20 })
  accountStatus: string;

  @Column({ length: 10 })
  status: string;
}

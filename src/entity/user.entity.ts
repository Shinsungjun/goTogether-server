import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 15 })
  phoneNumber: string;

  // 아이디
  @Column({ length: 15 })
  userName: string;

  @Column()
  password: string;

  @Column({ length: 10 })
  nickName: string;

  @Column({ type: 'date' })
  privacyAcceptedAt: string;

  @Column({ length: 20 })
  accountStatus: string;

  @Column()
  userDeleteReasonId: number;

  @Column()
  deleteEtcContents: string;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

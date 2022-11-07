import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ReviewReportReason')
export class ReviewReportReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'ACTIVE' })
  status: string;
}

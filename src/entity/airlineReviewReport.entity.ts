import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AirlineReviewReport')
export class AirlineReviewReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  airlineReviewId: number;

  @Column()
  reviewReportReasonId: number;

  @Column()
  etcReason: string;

  @Column({ default: 'WAITING' })
  reportStatus: string;

  @Column({ default: 'ACTIVE' })
  status: string;
}

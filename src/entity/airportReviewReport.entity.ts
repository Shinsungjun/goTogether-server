import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AirportReviewReport')
export class AirportReviewReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  airportReviewId: number;

  @Column()
  reviewReportReasonId: number;

  @Column()
  etcReason: string;

  @Column({ default: 'WAITING' })
  reportStatus: string;

  @Column({ default: 'ACTIVE' })
  status: string;
}

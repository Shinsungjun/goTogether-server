import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ReviewAirportService')
export class ReviewAirportService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airportServiceId: number;

  @Column()
  airportReviewId: number;

  @Column({ default: 'ACTIVE' })
  status: string;
}

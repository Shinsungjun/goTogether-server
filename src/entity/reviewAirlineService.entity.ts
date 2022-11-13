import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ReviewAirlineService')
export class ReviewAirlineService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airlineServiceId: number;

  @Column()
  airlineReviewId: number;

  @Column({ default: 'ACTIVE' })
  status: string;
}

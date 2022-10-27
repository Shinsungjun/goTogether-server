import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AirportReview')
export class AirportReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  airportId: number;

  @Column()
  content: string;

  @Column()
  score: number;

  @Column({ default: 'ACTIVE' })
  status: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AirlineReview')
export class AirlineReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  airlineId: number;

  @Column()
  content: string;

  @Column()
  score: number;

  @Column({ default: 'ACTIVE' })
  status: string;
}

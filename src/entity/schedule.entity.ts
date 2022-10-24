import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startAt: string;

  @Column()
  endAt: string;

  @Column()
  departureAirportId: number;

  @Column()
  arrivalAirportId: number;

  @Column()
  airlineId: number;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

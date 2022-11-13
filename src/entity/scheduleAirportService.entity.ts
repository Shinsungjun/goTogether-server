import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ScheduleAirportService')
export class ScheduleAirportService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scheduleId: number;

  @Column()
  airportServiceId: number;

  @Column({ length: 15 })
  type: string;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

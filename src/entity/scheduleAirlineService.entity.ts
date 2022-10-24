import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ScheduleAirlineService')
export class ScheduleAirlineService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scheduleId: number;

  @Column()
  airlineServiceId: number;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

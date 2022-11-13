import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AirportService')
export class AirportService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airportId: number;

  @Column({ length: 45 })
  name: string;

  @Column()
  website: string;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

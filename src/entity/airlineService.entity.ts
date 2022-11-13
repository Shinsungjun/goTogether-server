import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AirlineService')
export class AirlineService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airlineId: number;

  @Column({ length: 45 })
  name: string;

  @Column()
  website: string;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

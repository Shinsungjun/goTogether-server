import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Airline')
export class Airline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column()
  logoImageUrl: string;

  @Column({ length: 15 })
  customerServiceNumber: string;

  @Column({ length: 45 })
  availableAt: string;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

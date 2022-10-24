import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Airport')
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column({ length: 15 })
  customerServiceNumber: string;

  @Column({ length: 45 })
  availableAt: string;

  @Column({ length: 10, default: 'ACTIVE' })
  status: string;
}

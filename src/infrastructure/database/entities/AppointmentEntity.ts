import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CountryISO } from '../../../domain/value-objects/CountryISO';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  appointmentId!: string;

  @Column({ type: 'varchar', length: 255 })
  insuredId!: string;

  @Column({ type: 'int' })
  scheduleId!: number;

  @Column({ type: 'enum', enum: CountryISO })
  countryISO!: CountryISO;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}

import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentStatus } from '../../domain/value-objects/AppointmentStatus';

export interface IAppointmentNoSQLRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
  updateStatus(id: string, status: AppointmentStatus): Promise<void>;
}

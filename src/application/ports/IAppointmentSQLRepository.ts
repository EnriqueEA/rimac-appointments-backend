import { Appointment } from '../../domain/entities/Appointment';

export interface IAppointmentSQLRepository {
  save(appointment: Appointment): Promise<void>;
}

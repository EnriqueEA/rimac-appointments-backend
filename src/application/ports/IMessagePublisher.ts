import { Appointment } from '../../domain/entities/Appointment';

export interface IMessagePublisher {
  publishAppointment(appointment: Appointment): Promise<void>;
}

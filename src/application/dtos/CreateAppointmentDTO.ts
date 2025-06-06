import { Appointment } from '../../domain/entities/Appointment';

export type CreateAppointmentDTO = Omit<Appointment, 'appointmentId' | 'status'>;

export interface CreateAppointmentResponseDTO {
  message: string;
  status: string;
}

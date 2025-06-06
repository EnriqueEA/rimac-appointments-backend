import { Appointment } from '../../domain/entities/Appointment';

export type ProcessAppointmentDTO = Omit<Appointment, 'status'>;

import { AppointmentStatus } from '../../domain/value-objects/AppointmentStatus';
import { CountryISO } from '../../domain/value-objects/CountryISO';

export interface CompleteAppointmentDTO {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  country: CountryISO;
  status: AppointmentStatus;
}

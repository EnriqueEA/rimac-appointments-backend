import { AppointmentStatus } from '../value-objects/AppointmentStatus';
import { CountryISO } from '../value-objects/CountryISO';

export class Appointment {
  constructor(
    public readonly appointmentId: string,
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO?: CountryISO,
    public status?: AppointmentStatus,
  ) {
    this.validateInsuredId();
  }

  private validateInsuredId(): void {
    if (!this.insuredId.match(/^\d{5}$/)) {
      throw new Error('Insured ID must be exactly 5 digits');
    }
  }
}

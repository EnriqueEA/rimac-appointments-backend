import { Appointment } from '../../../src/domain/entities/Appointment';
import { AppointmentStatus } from '../../../src/domain/value-objects/AppointmentStatus';
import { CountryISO } from '../../../src/domain/value-objects/CountryISO';

describe('Appointment Entity', () => {
  test('should create appointment with all parameters', () => {
    const appointment = new Appointment(
      'app-123',
      '12345',
      1,
      CountryISO.PE,
      AppointmentStatus.PENDING,
    );

    expect(appointment.appointmentId).toBe('app-123');
    expect(appointment.insuredId).toBe('12345');
    expect(appointment.scheduleId).toBe(1);
    expect(appointment.countryISO).toBe(CountryISO.PE);
    expect(appointment.status).toBe(AppointmentStatus.PENDING);
  });

  test('should create appointment with required parameters only', () => {
    const appointment = new Appointment('app-456', '54321', 2);

    expect(appointment.appointmentId).toBe('app-456');
    expect(appointment.insuredId).toBe('54321');
    expect(appointment.scheduleId).toBe(2);
    expect(appointment.countryISO).toBeUndefined();
    expect(appointment.status).toBeUndefined();
  });

  test('should accept valid 5-digit insured ID', () => {
    expect(() => new Appointment('app-123', '12345', 1)).not.toThrow();
    expect(() => new Appointment('app-123', '00123', 1)).not.toThrow();
  });

  test('should reject invalid insured ID', () => {
    expect(() => new Appointment('app-123', '1234', 1)).toThrow(
      'Insured ID must be exactly 5 digits',
    );
    expect(() => new Appointment('app-123', '123456', 1)).toThrow(
      'Insured ID must be exactly 5 digits',
    );
    expect(() => new Appointment('app-123', '1234a', 1)).toThrow(
      'Insured ID must be exactly 5 digits',
    );
  });
});

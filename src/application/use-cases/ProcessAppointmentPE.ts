import { Appointment } from '../../domain/entities/Appointment';
import { ProcessAppointmentDTO } from '../dtos/ProcessAppointmentDTO';
import { IAppointmentSQLRepository } from '../ports/IAppointmentSQLRepository';
import { IEventPublisher } from '../ports/IEventPublisher';

export class ProcessAppointmentPEUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentSQLRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(appointmentDTO: ProcessAppointmentDTO): Promise<void> {
    const appointment = new Appointment(
      appointmentDTO.appointmentId,
      appointmentDTO.insuredId,
      appointmentDTO.scheduleId,
    );
    await this.appointmentRepository.save(appointment);
    await this.eventPublisher.publish('AppointmentProcessed', appointment.appointmentId);
  }
}

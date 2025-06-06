import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentStatus } from '../../domain/value-objects/AppointmentStatus';
import { IAppointmentNoSQLRepository } from '../ports/IAppointmentNoSQLRepository';
import { CreateAppointmentDTO, CreateAppointmentResponseDTO } from '../dtos/CreateAppointmentDTO';
import { IMessagePublisher } from '../ports/IMessagePublisher';
import { v4 as uuid } from 'uuid';

export class AddAppointmentToQueueUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentNoSQLRepository,
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  async execute(dto: CreateAppointmentDTO): Promise<CreateAppointmentResponseDTO> {
    const appointmentId = uuid();
    const appointment = new Appointment(
      appointmentId,
      dto.insuredId,
      dto.scheduleId,
      dto.countryISO,
      AppointmentStatus.PENDING,
    );

    await this.appointmentRepository.save(appointment);

    await this.messagePublisher.publishAppointment(appointment);

    return {
      message: 'Appointment scheduling is in process',
      status: AppointmentStatus.PENDING,
    };
  }
}

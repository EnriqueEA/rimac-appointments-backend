import { DataSource, Repository } from 'typeorm';
import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentEntity } from '../database/entities/AppointmentEntity';
import { AppointmentMapper } from '../database/mappers/AppointmentMapper';
import { IAppointmentSQLRepository } from '../../application/ports/IAppointmentSQLRepository';

export class MySQLAppointmentRepository implements IAppointmentSQLRepository {
  private appointmentRepository: Repository<AppointmentEntity>;

  constructor(datasource: DataSource) {
    this.appointmentRepository = datasource.getRepository(AppointmentEntity);
  }

  async save(appointment: Appointment): Promise<void> {
    try {
      const appointmentEntity = AppointmentMapper.toPersistence(appointment);

      await this.appointmentRepository.save(appointmentEntity);
    } catch (error) {
      throw new Error(
        `Failed to save appointment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findById(appointmentId: string): Promise<Appointment | null> {
    try {
      const appointmentEntity = await this.appointmentRepository.findOne({
        where: { appointmentId },
      });

      if (!appointmentEntity) {
        return null;
      }

      return AppointmentMapper.toDomain(appointmentEntity);
    } catch (error) {
      throw new Error(
        `Failed to find appointment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

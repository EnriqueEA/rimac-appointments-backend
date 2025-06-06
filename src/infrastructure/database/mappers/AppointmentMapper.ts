import { Appointment } from '../../../domain/entities/Appointment';
import { AppointmentEntity } from '../entities/AppointmentEntity';
import { CountryISO } from '../../../domain/value-objects/CountryISO';
import { AppointmentStatus } from '../../../domain/value-objects/AppointmentStatus';

// Mapper Pattern para convertir entre Domain Entity y Database Entity
export class AppointmentMapper {
  // Convierte de Domain Entity a Database Entity
  public static toPersistence(domainAppointment: Appointment): AppointmentEntity {
    const entity = new AppointmentEntity();

    entity.appointmentId = domainAppointment.appointmentId;
    entity.insuredId = domainAppointment.insuredId;
    entity.scheduleId = domainAppointment.scheduleId;
    entity.countryISO = domainAppointment.countryISO as CountryISO;
    entity.status = domainAppointment.status as AppointmentStatus;

    return entity;
  }

  // Convierte de Database Entity a Domain Entity
  public static toDomain(persistenceAppointment: AppointmentEntity): Appointment {
    return new Appointment(
      persistenceAppointment.appointmentId,
      persistenceAppointment.insuredId,
      persistenceAppointment.scheduleId,
      persistenceAppointment.countryISO as CountryISO,
      persistenceAppointment.status as AppointmentStatus,
    );
  }

  // Convierte múltiples entidades de DB a Domain
  // public static toDomainList(
  //   persistenceAppointments: AppointmentEntity[],
  // ): Appointment[] {
  //   return persistenceAppointments.map((entity) => this.toDomain(entity));
  // }

  // Actualiza una entidad existente con datos del dominio
  // public static updateEntity(
  //   existingEntity: AppointmentEntity,
  //   domainAppointment: Appointment,
  // ): AppointmentEntity {
  //   existingEntity.insuredId = domainAppointment.insuredId;
  //   existingEntity.scheduleId = domainAppointment.scheduleId;
  //   existingEntity.countryISO = domainAppointment.countryISO as CountryISO;
  //   existingEntity.status = domainAppointment.status as AppointmentStatus;

  //   return existingEntity;
  // }
}

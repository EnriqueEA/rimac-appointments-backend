import { SQSEvent } from 'aws-lambda';
import { MySQLAppointmentRepository } from '../../infrastructure/repositories/MySQLAppointmentRepository';
import { CountryISO } from '../../domain/value-objects/CountryISO';
import { ProcessAppointmentPEUseCase } from '../../application/use-cases/ProcessAppointmentPE';
import { EventBridgePublisher } from '../../infrastructure/services/EventBridgePublisher';
import { DatabaseConnectionFactory } from '../../infrastructure/database/DatabaseConnectionFactory';
import { CompleteAppointmentDTO } from '../../application/dtos/FinishAppointmentDTO';

export const handler = async (event: SQSEvent): Promise<void> => {
  const dbConnectionPE = await DatabaseConnectionFactory.get(CountryISO.PE);
  const mysqlAppointmentRepositoryPE = new MySQLAppointmentRepository(dbConnectionPE);
  const eventBridgePublisher = new EventBridgePublisher();
  const processAppointmentPEUseCase = new ProcessAppointmentPEUseCase(
    mysqlAppointmentRepositoryPE,
    eventBridgePublisher,
  );

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      const appointmentDTO: CompleteAppointmentDTO = JSON.parse(
        message.detail || message.Message || '{}',
      );

      await processAppointmentPEUseCase.execute(appointmentDTO);
    } catch (error) {
      console.error('Error registering appointment in SQL Database:', error);
      throw error;
    }
  }
};

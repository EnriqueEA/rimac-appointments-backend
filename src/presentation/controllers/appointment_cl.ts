import { SQSEvent } from 'aws-lambda';
import { MySQLAppointmentRepository } from '../../infrastructure/repositories/MySQLAppointmentRepository';
import { CountryISO } from '../../domain/value-objects/CountryISO';
import { EventBridgePublisher } from '../../infrastructure/services/EventBridgePublisher';
import { DatabaseConnectionFactory } from '../../infrastructure/database/DatabaseConnectionFactory';
import { ProcessAppointmentCLUseCase } from '../../application/use-cases/ProcessAppointmentCL';
import { CompleteAppointmentDTO } from '../../application/dtos/FinishAppointmentDTO';

export const handler = async (event: SQSEvent): Promise<void> => {
  const dbConnectionCL = await DatabaseConnectionFactory.get(CountryISO.CL);
  const mysqlAppointmentRepositoryCL = new MySQLAppointmentRepository(dbConnectionCL);
  const eventBridgePublisher = new EventBridgePublisher();
  const processAppointmentCLUseCase = new ProcessAppointmentCLUseCase(
    mysqlAppointmentRepositoryCL,
    eventBridgePublisher,
  );

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      const appointmentDTO: CompleteAppointmentDTO = JSON.parse(
        message.detail || message.Message || '{}',
      );

      await processAppointmentCLUseCase.execute(appointmentDTO);
    } catch (error) {
      console.error('Error registering appointment in SQL Database:', error);
      throw error;
    }
  }
};

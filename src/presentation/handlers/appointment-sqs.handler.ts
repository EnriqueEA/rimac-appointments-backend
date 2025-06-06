import { SQSEvent } from 'aws-lambda';
import { DynamoDBAppointmentRepository } from '../../infrastructure/repositories/DynamoDBAppointmentRepository';
import { AppointmentStatus } from '../../domain/value-objects/AppointmentStatus';

// Dependencies
const repository = new DynamoDBAppointmentRepository();

/**
 * Processes appointment completion by updating status to COMPLETED
 */
async function completeAppointment(appointmentId: string): Promise<void> {
  const appointment = await repository.findById(appointmentId);

  if (!appointment) {
    throw new Error(`Appointment not found with ID: ${appointmentId}`);
  }

  await repository.updateStatus(appointmentId, AppointmentStatus.COMPLETED);
  console.log(`Appointment ${appointmentId} status updated to COMPLETED`);
}

/**
 * Handles SQS events for appointment completion processing
 */
export async function handleSqsEvent(event: SQSEvent): Promise<void> {
  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      const appointmentId: string = message.detail?.appointmentId;

      if (!appointmentId) {
        throw new Error('Missing appointmentId in SQS message detail');
      }

      await completeAppointment(appointmentId);
      console.log('Successfully processed appointment completion:', appointmentId);
    } catch (error) {
      console.error('Error processing SQS record:', record.messageId, error);
      throw error;
    }
  }
}

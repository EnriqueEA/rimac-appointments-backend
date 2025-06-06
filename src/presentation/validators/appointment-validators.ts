import { APIGatewayProxyResult } from 'aws-lambda';
import { CreateAppointmentDTO } from '../../application/dtos/CreateAppointmentDTO';
import { createErrorResponse } from '../shared/event-utils';

/**
 * Validates the request body for appointment creation
 */
export function validateCreateAppointmentRequest(
  body: CreateAppointmentDTO,
): APIGatewayProxyResult | null {
  const requiredFields: (keyof CreateAppointmentDTO)[] = ['insuredId', 'scheduleId', 'countryISO'];
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400, {
      requiredFields,
    });
  }

  return null; // Valid request
}

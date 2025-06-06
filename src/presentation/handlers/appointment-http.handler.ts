import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBAppointmentRepository } from '../../infrastructure/repositories/DynamoDBAppointmentRepository';
import { AddAppointmentToQueueUseCase } from '../../application/use-cases/AddAppointmentToQueueUseCase';
import { SNSAppointmentPublisher } from '../../infrastructure/services/SNSAppointmentPublisher';
import { validateCreateAppointmentRequest } from '../validators/appointment-validators';
import { handleCreateAppointmentError, handleGeneralError } from '../errors/appointment-errors';
import { createSuccessResponse, createErrorResponse } from '../shared/event-utils';

// Dependencies
const repository = new DynamoDBAppointmentRepository();
const publisher = new SNSAppointmentPublisher();
const createAppointmentUseCase = new AddAppointmentToQueueUseCase(repository, publisher);

/**
 * Handles GET requests to list appointments by insured ID
 */
async function handleListByInsuredId(insuredId: string): Promise<APIGatewayProxyResult> {
  try {
    const appointments = await repository.findByInsuredId(insuredId);

    return createSuccessResponse(appointments, 'Appointments fetched successfully');
  } catch (error) {
    return handleGeneralError(error as Error, 'fetching appointments by insured ID');
  }
}

/**
 * Handles POST requests to create new appointments
 */
async function handleCreateAppointment(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return createErrorResponse('Request body is missing', 400);
    }

    const body = JSON.parse(event.body);
    const validationError = validateCreateAppointmentRequest(body);

    if (validationError) {
      return validationError;
    }

    const result = await createAppointmentUseCase.execute({
      insuredId: body.insuredId,
      scheduleId: body.scheduleId,
      countryISO: body.countryISO,
    });

    return createSuccessResponse(result, 'Appointment creation request accepted', 202);
  } catch (error) {
    return handleCreateAppointmentError(error as Error);
  }
}

/**
 * Main HTTP event handler
 */
export async function handleHttpEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Processing HTTP event:', {
    method: event.httpMethod,
    path: event.path,
    pathParameters: event.pathParameters,
  });

  const method = event.httpMethod;

  if (method === 'GET' && event.pathParameters?.insuredId) {
    return handleListByInsuredId(event.pathParameters.insuredId);
  }

  if (method === 'POST') {
    return handleCreateAppointment(event);
  }

  return createErrorResponse(`Method ${method} not allowed`, 405, {
    allowedMethods: ['GET', 'POST'],
  });
}

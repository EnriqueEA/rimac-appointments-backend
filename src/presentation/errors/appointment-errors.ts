import { APIGatewayProxyResult } from 'aws-lambda';
import { createErrorResponse } from '../shared/event-utils';

/**
 * Handles errors during appointment creation with appropriate HTTP responses
 */
export function handleCreateAppointmentError(error: Error): APIGatewayProxyResult {
  console.error('Error creating appointment:', error);

  // Handle validation errors
  if (
    error.message.includes('Invalid country code') ||
    error.message.includes('must be exactly 5 digits')
  ) {
    return createErrorResponse(error.message, 400);
  }

  // Handle general server errors - don't expose internal details
  return createErrorResponse('Internal server error', 500);
}

/**
 * Handles general errors with logs
 */
export function handleGeneralError(
  error: Error,
  context: string,
  statusCode: number = 500,
): APIGatewayProxyResult {
  console.error(`Error in ${context}:`, error);
  return createErrorResponse('Internal server error', statusCode);
}

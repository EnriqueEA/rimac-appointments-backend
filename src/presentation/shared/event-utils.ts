import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';

/**
 * Determines if the incoming event is an SQS event
 */
export function isSqsEvent(event: APIGatewayProxyEvent | SQSEvent): event is SQSEvent {
  return 'Records' in event && Array.isArray(event.Records);
}

/**
 * Creates a standardized API Gateway response
 */
export function createApiResponse(
  statusCode: number,
  body: object,
  headers?: Record<string, string>,
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

/**
 * Creates a success response
 */
export function createSuccessResponse(
  data: unknown,
  message: string,
  statusCode: number = 200,
): APIGatewayProxyResult {
  return createApiResponse(statusCode, {
    success: true,
    data,
    message,
  });
}

/**
 * Creates an error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  details?: unknown,
): APIGatewayProxyResult {
  const response: { success: boolean; message: string; details?: unknown } = {
    success: false,
    message,
  };

  if (details !== undefined && details !== null) {
    response.details = details;
  }

  return createApiResponse(statusCode, response);
}

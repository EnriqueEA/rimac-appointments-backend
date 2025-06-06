import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { isSqsEvent } from '../shared/event-utils';
import { handleHttpEvent } from '../handlers/appointment-http.handler';
import { handleSqsEvent } from '../handlers/appointment-sqs.handler';

export const handler = async (
  event: APIGatewayProxyEvent | SQSEvent,
): Promise<APIGatewayProxyResult | void> => {
  if (isSqsEvent(event)) {
    await handleSqsEvent(event);
    return;
  }
  return handleHttpEvent(event);
};

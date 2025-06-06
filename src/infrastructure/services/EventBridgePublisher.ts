import EventBridge, { PutEventsRequest } from 'aws-sdk/clients/eventbridge';
import { IEventPublisher } from '../../application/ports/IEventPublisher';

export class EventBridgePublisher implements IEventPublisher {
  private readonly eventBridge: EventBridge;

  constructor() {
    this.eventBridge = new EventBridge();
  }

  async publish(eventName: string, appointmentId: string): Promise<void> {
    const params: PutEventsRequest = {
      Entries: [
        {
          Source: 'appointment.completion',
          DetailType: eventName,
          Detail: JSON.stringify({ appointmentId }),
          EventBusName: process.env.EVENTBRIDGE_COMPLETION_BUS,
        },
      ],
    };

    await this.eventBridge.putEvents(params).promise();
  }
}

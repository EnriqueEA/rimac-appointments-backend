export interface IEventPublisher {
  publish(event: string, appointmentId: string): Promise<void>;
}

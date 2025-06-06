export interface IQueuePublisher {
  deleteMessage(receiptHandle: string): Promise<void>;
}

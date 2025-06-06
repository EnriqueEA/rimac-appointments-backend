import SQS from 'aws-sdk/clients/sqs';
import { IQueuePublisher } from '../../application/ports/IQueeuePublisher';

type QueueConfig = 'appointments-pe' | 'appointments-cl' | 'completions';

export class SQSAppointmentPublisher implements IQueuePublisher {
  private sqs: SQS;
  private queueUrlMap: Record<QueueConfig, string>;

  constructor(private readonly queueName: QueueConfig) {
    this.sqs = new SQS();

    this.queueUrlMap = {
      'appointments-pe': process.env.SQS_APPOINTMENTS_PE_URL || '',
      'appointments-cl': process.env.SQS_APPOINTMENTS_CL_URL || '',
      completions: process.env.SQS_COMPLETIONS_URL || '',
    };
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      await this.sqs
        .deleteMessage({
          QueueUrl: this.queueUrlMap[this.queueName],
          ReceiptHandle: receiptHandle,
        })
        .promise();

      console.log(`Message deleted successfully from queue: ${this.queueName}`);
    } catch (error) {
      console.error(`Error deleting message from queue ${this.queueName}:`, error);
      throw error;
    }
  }
}

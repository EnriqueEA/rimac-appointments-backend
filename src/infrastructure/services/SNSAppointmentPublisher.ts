import SNS from 'aws-sdk/clients/sns';
import { Appointment } from '../../domain/entities/Appointment';
import { IMessagePublisher } from '../../application/ports/IMessagePublisher';
import { PublishInput } from 'aws-sdk/clients/sns';
import { CountryISO } from '../../domain/value-objects/CountryISO';

export class SNSAppointmentPublisher implements IMessagePublisher {
  private sns: SNS;
  private topicArnMap: Record<string, string>;

  constructor() {
    this.sns = new SNS();
    this.topicArnMap = {
      [CountryISO.PE]: process.env.SNS_APPOINTMENTS_TOPIC_ARN_PE || '',
      [CountryISO.CL]: process.env.SNS_APPOINTMENTS_TOPIC_ARN_CL || '',
    };
  }

  async publishAppointment(appointment: Appointment): Promise<void> {
    const countryISO = appointment.countryISO;
    const topicArn = this.topicArnMap[countryISO!];
    if (!topicArn) {
      throw new Error(`SNS TopicArn not configured for countryISO: ${countryISO}`);
    }

    const message = {
      appointmentId: appointment.appointmentId,
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
    };

    const params: PublishInput = {
      TopicArn: topicArn,
      Message: JSON.stringify(message),
      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue: countryISO!.toString(),
        },
      },
    };

    await this.sns.publish(params).promise();
  }
}

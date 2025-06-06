import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Appointment } from '../../domain/entities/Appointment';
import { CountryISO } from '../../domain/value-objects/CountryISO';
import { AppointmentStatus } from '../../domain/value-objects/AppointmentStatus';
import { IAppointmentNoSQLRepository } from '../../application/ports/IAppointmentNoSQLRepository';

export class DynamoDBAppointmentRepository implements IAppointmentNoSQLRepository {
  private docClient: DynamoDB.DocumentClient;
  private tableName: string;

  constructor() {
    this.docClient = new DynamoDB.DocumentClient();
    this.tableName = process.env.DYNAMODB_APPOINTMENT_TABLE || '';
  }
  async updateStatus(appointmentId: string, status: AppointmentStatus): Promise<void> {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: { appointmentId },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
    };

    await this.docClient.update(params).promise();
  }

  async save(appointment: Appointment): Promise<void> {
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: {
        appointmentId: appointment.appointmentId,
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        country: appointment.countryISO,
        status: appointment.status,
        createdAt: new Date().toISOString(),
      },
    };

    await this.docClient.put(params).promise();
  }

  async findById(appointmentId: string): Promise<Appointment | null> {
    const params = {
      TableName: this.tableName,
      Key: { appointmentId },
    };

    const result = await this.docClient.get(params).promise();

    if (!result.Item) {
      return null;
    }

    return new Appointment(
      result.Item.appointmentId,
      result.Item.insuredId,
      result.Item.scheduleId,
      result.Item.country as CountryISO,
      result.Item.status as AppointmentStatus,
    );
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'insuredId-index', // GSI name
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    };
    const result = await this.docClient.query(params).promise();
    if (!result.Items) return [];
    return result.Items.map(
      (item) =>
        new Appointment(
          item.appointmentId,
          item.insuredId,
          item.scheduleId,
          item.country as CountryISO,
          item.status as AppointmentStatus,
        ),
    );
  }
}

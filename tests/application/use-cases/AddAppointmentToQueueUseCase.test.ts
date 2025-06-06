import { CreateAppointmentDTO } from '../../../src/application/dtos/CreateAppointmentDTO';
import { IAppointmentNoSQLRepository } from '../../../src/application/ports/IAppointmentNoSQLRepository';
import { IMessagePublisher } from '../../../src/application/ports/IMessagePublisher';
import { AddAppointmentToQueueUseCase } from '../../../src/application/use-cases/AddAppointmentToQueueUseCase';
import { AppointmentStatus } from '../../../src/domain/value-objects/AppointmentStatus';
import { CountryISO } from '../../../src/domain/value-objects/CountryISO';

const mockAppointmentRepository: jest.Mocked<IAppointmentNoSQLRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  updateStatus: jest.fn(),
};

const mockMessagePublisher: jest.Mocked<IMessagePublisher> = {
  publishAppointment: jest.fn(),
};

describe('AddAppointmentToQueueUseCase', () => {
  let useCase: AddAppointmentToQueueUseCase;

  beforeEach(() => {
    useCase = new AddAppointmentToQueueUseCase(mockAppointmentRepository, mockMessagePublisher);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validAppointmentData: CreateAppointmentDTO = {
      insuredId: '12345',
      scheduleId: 1,
      countryISO: CountryISO.PE,
    };

    test('should add appointment to queue', async () => {
      await useCase.execute(validAppointmentData);

      expect(mockAppointmentRepository.save).toHaveBeenCalled();
      expect(mockMessagePublisher.publishAppointment).toHaveBeenCalled();
    });

    test('should return pending status', async () => {
      const expectedResponse = {
        message: 'Appointment scheduling is in process',
        status: AppointmentStatus.PENDING,
      };

      const response = await useCase.execute(validAppointmentData);

      expect(response).toEqual(expectedResponse);
    });

    test('should throw error if appointment repository fails', async () => {
      mockAppointmentRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(validAppointmentData)).rejects.toThrow('Database error');
    });
  });
});

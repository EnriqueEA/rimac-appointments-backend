import { ProcessAppointmentPEUseCase } from '../../../src/application/use-cases/ProcessAppointmentPE';
import { IAppointmentSQLRepository } from '../../../src/application/ports/IAppointmentSQLRepository';
import { IEventPublisher } from '../../../src/application/ports/IEventPublisher';
import { ProcessAppointmentDTO } from '../../../src/application/dtos/ProcessAppointmentDTO';

const mockRepository: jest.Mocked<IAppointmentSQLRepository> = {
  save: jest.fn(),
};

const mockEventPublisher: jest.Mocked<IEventPublisher> = {
  publish: jest.fn(),
};

describe('ProcessAppointmentPEUseCase', () => {
  let useCase: ProcessAppointmentPEUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new ProcessAppointmentPEUseCase(mockRepository, mockEventPublisher);
  });

  const validAppointmentDTO: ProcessAppointmentDTO = {
    appointmentId: 'app-456',
    insuredId: '54321',
    scheduleId: 2,
  };

  it('should process appointment successfully', async () => {
    await useCase.execute(validAppointmentDTO);

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        appointmentId: 'app-456',
        insuredId: '54321',
        scheduleId: 2,
      }),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledWith('AppointmentProcessed', 'app-456');
  });

  it('should handle invalid insured ID', async () => {
    const invalidDTO = { ...validAppointmentDTO, insuredId: '123' };

    await expect(useCase.execute(invalidDTO)).rejects.toThrow(
      'Insured ID must be exactly 5 digits',
    );

    expect(mockRepository.save).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it('should handle repository save errors', async () => {
    mockRepository.save.mockRejectedValue(new Error('Database connection failed'));

    await expect(useCase.execute(validAppointmentDTO)).rejects.toThrow(
      'Database connection failed',
    );
  });

  it('should handle event publisher errors', async () => {
    mockEventPublisher.publish.mockRejectedValue(new Error('Event publish failed'));

    await expect(useCase.execute(validAppointmentDTO)).rejects.toThrow('Event publish failed');
  });
});

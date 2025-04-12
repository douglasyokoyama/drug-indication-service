import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteDrugIndicationUseCase } from './delete-drug-indication.use-case';
import { Types } from 'mongoose';

describe('DeleteDrugIndicationUseCase', () => {
  let useCase: DeleteDrugIndicationUseCase;

  const mockDrugIndicationRepository = {
    delete: jest.fn(),
    findById: jest.fn(),
  };

  const mockDrugIndicationId = new Types.ObjectId().toString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteDrugIndicationUseCase,
        {
          provide: 'DRUG_INDICATION_REPOSITORY',
          useValue: mockDrugIndicationRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteDrugIndicationUseCase>(
      DeleteDrugIndicationUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a drug indication when it exists', async () => {
      mockDrugIndicationRepository.findById.mockResolvedValue({
        _id: mockDrugIndicationId,
      });

      await useCase.execute(mockDrugIndicationId);

      expect(mockDrugIndicationRepository.delete).toHaveBeenCalledWith(
        mockDrugIndicationId,
      );
    });

    it('should throw NotFoundException when drug indication does not exist', async () => {
      mockDrugIndicationRepository.findById.mockResolvedValue(null); // Simulate non-existing indication

      await expect(useCase.execute(mockDrugIndicationId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockDrugIndicationRepository.delete).not.toHaveBeenCalled();
    });
  });
});

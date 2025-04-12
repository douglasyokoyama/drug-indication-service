import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DrugIndication } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { UpdateDrugIndicationDto } from '../dto/update-drug-indication.dto';
import { UpdateDrugIndicationUseCase } from './update-drug-indication.use-case';
import { DRUG_INDICATION_REPOSITORY } from './create-drug-indication.use-case';

describe('UpdateDrugIndicationUseCase', () => {
  let useCase: UpdateDrugIndicationUseCase;

  const mockDrugIndicationRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockDrugIndicationId = '1';
  const mockUpdateDto: UpdateDrugIndicationDto = {
    drugName: 'Updated Drug Indication',
    description: 'Updated description.',
  };

  const mockExistingIndication: DrugIndication = {
    drugName: 'Test Drug Indication',
    description: 'This is a test drug indication.',
    indication: 'Indication',
    icd10Code: 'ICD10',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDrugIndicationUseCase,
        {
          provide: DRUG_INDICATION_REPOSITORY,
          useValue: mockDrugIndicationRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateDrugIndicationUseCase>(
      UpdateDrugIndicationUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a drug indication when it exists', async () => {
      mockDrugIndicationRepository.findById.mockResolvedValue(
        mockExistingIndication,
      );
      mockDrugIndicationRepository.update.mockResolvedValue({
        ...mockExistingIndication,
        ...mockUpdateDto,
      });

      const result = await useCase.execute(mockDrugIndicationId, mockUpdateDto);

      expect(result).toEqual({ ...mockExistingIndication, ...mockUpdateDto });
      expect(mockDrugIndicationRepository.findById).toHaveBeenCalledWith(
        mockDrugIndicationId,
      );
      expect(mockDrugIndicationRepository.update).toHaveBeenCalledWith(
        mockDrugIndicationId,
        mockUpdateDto,
      );
    });

    it('should throw NotFoundException when drug indication does not exist', async () => {
      mockDrugIndicationRepository.findById.mockResolvedValue(null); // Simulate non-existing indication

      await expect(
        useCase.execute(mockDrugIndicationId, mockUpdateDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockDrugIndicationRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when trying to update with an existing name', async () => {
      mockDrugIndicationRepository.findById.mockResolvedValue(
        mockExistingIndication,
      );
      mockDrugIndicationRepository.update.mockRejectedValue(
        new ConflictException('Drug indication name already exists.'),
      );

      await expect(
        useCase.execute(mockDrugIndicationId, mockUpdateDto),
      ).rejects.toThrow(ConflictException);
      expect(mockDrugIndicationRepository.update).toHaveBeenCalledWith(
        mockDrugIndicationId,
        mockUpdateDto,
      );
    });
  });
});

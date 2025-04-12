import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/find-all-drug-indication.use-case';
import { DrugIndication } from 'src/domain/drug-indications/entities/drug-indication.entity';

describe('FindDrugIndicationUseCase', () => {
  let useCase: FindAllDrugIndicationUseCase;

  const mockDrugIndicationRepository = {
    findById: jest.fn(),
  };

  const mockDrugIndication: DrugIndication = {
    drugName: 'Test Drug Indication',
    description: 'This is a test drug indication.',
    indication: 'Indication',
    icd10Code: 'ICD10',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllDrugIndicationUseCase,
        {
          provide: 'DRUG_INDICATION_REPOSITORY',
          useValue: mockDrugIndicationRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllDrugIndicationUseCase>(
      FindAllDrugIndicationUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a drug indication when it exists', async () => {
      mockDrugIndicationRepository.findById.mockResolvedValue(
        mockDrugIndication,
      );

      const result = await useCase.execute(mockDrugIndication.drugName);

      expect(result).toEqual(mockDrugIndication);
      expect(mockDrugIndicationRepository.findById).toHaveBeenCalledWith(
        mockDrugIndication.drugName,
      );
    });

    it('should throw NotFoundException when drug indication does not exist', async () => {
      mockDrugIndicationRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute(mockDrugIndication.drugName),
      ).rejects.toThrow(NotFoundException);
      expect(mockDrugIndicationRepository.findById).toHaveBeenCalledWith(
        mockDrugIndication.drugName,
      );
    });
  });
});

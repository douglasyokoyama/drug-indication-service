import { Test, TestingModule } from '@nestjs/testing';
import { FindByNameDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/find-name-drug-indication.use-case';
import { DrugIndication } from 'src/domain/drug-indications/entities/drug-indication.entity';

describe('FindDrugIndicationUseCase', () => {
  let useCase: FindByNameDrugIndicationUseCase;

  const mockDrugIndicationRepository = {
    findByDrugName: jest.fn(),
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
        FindByNameDrugIndicationUseCase,
        {
          provide: 'DRUG_INDICATION_REPOSITORY',
          useValue: mockDrugIndicationRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindByNameDrugIndicationUseCase>(
      FindByNameDrugIndicationUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a drug indication when it exists', async () => {
      mockDrugIndicationRepository.findByDrugName.mockResolvedValue(
        mockDrugIndication,
      );

      const result = await useCase.execute(mockDrugIndication.drugName);

      expect(result).toEqual(mockDrugIndication);
      expect(mockDrugIndicationRepository.findByDrugName).toHaveBeenCalledWith(
        mockDrugIndication.drugName,
      );
    });
  });
});

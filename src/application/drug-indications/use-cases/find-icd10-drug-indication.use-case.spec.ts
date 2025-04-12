import { Test, TestingModule } from '@nestjs/testing';
import { FindByIcd10CodeDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/find-icd10-drug-indication.use-case';
import { DrugIndication } from 'src/domain/drug-indications/entities/drug-indication.entity';

describe('FindDrugIndicationUseCase', () => {
  let useCase: FindByIcd10CodeDrugIndicationUseCase;

  const mockDrugIndicationRepository = {
    findByIcd10Code: jest.fn(),
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
        FindByIcd10CodeDrugIndicationUseCase,
        {
          provide: 'DRUG_INDICATION_REPOSITORY',
          useValue: mockDrugIndicationRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindByIcd10CodeDrugIndicationUseCase>(
      FindByIcd10CodeDrugIndicationUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a drug indication when it exists', async () => {
      mockDrugIndicationRepository.findByIcd10Code.mockResolvedValue(
        mockDrugIndication,
      );

      const result = await useCase.execute(mockDrugIndication.icd10Code);

      expect(result).toEqual(mockDrugIndication);
      expect(mockDrugIndicationRepository.findByIcd10Code).toHaveBeenCalledWith(
        mockDrugIndication.icd10Code,
      );
    });
  });
});

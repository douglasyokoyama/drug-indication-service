import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DrugIndication } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { CreateDrugIndicationUseCase } from './create-drug-indication.use-case';

describe('CreateDrugIndicationUseCase', () => {
  let useCase: CreateDrugIndicationUseCase;

  const mockDrugIndicationRepository = {
    create: jest.fn(),
    findByName: jest.fn(),
  };

  const mockDrugIndication: Partial<DrugIndication> = {
    drugName: 'Test Drug Indication',
    description: 'This is a test drug indication.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDrugIndicationUseCase,
        {
          provide: 'DRUG_INDICATION_REPOSITORY',
          useValue: mockDrugIndicationRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateDrugIndicationUseCase>(
      CreateDrugIndicationUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a drug indication when it does not exist', async () => {
      mockDrugIndicationRepository.findByName.mockResolvedValue(null); // No existing indication

      const result = await useCase.execute(
        mockDrugIndication as DrugIndication,
      );

      expect(result).toEqual(mockDrugIndication);
      expect(mockDrugIndicationRepository.create).toHaveBeenCalledWith(
        mockDrugIndication,
      );
    });
  });
});

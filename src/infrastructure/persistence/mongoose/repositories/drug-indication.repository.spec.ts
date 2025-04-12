import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DrugIndication } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { DrugIndicationRepository } from './drug-indication.repository';

describe('DrugIndicationRepository', () => {
  let repository: DrugIndicationRepository;

  const mockDrugIndicationModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrugIndicationRepository,
        {
          provide: getModelToken(DrugIndication.name),
          useValue: mockDrugIndicationModel,
        },
      ],
    }).compile();

    repository = module.get<DrugIndicationRepository>(DrugIndicationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of drug indications', async () => {
      const mockDrugIndications = [
        { id: '1', name: 'Indication One' },
        { id: '2', name: 'Indication Two' },
      ];

      mockDrugIndicationModel.find.mockResolvedValue(mockDrugIndications);

      const result = await repository.findAll();

      expect(result).toEqual(mockDrugIndications);
      expect(mockDrugIndicationModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a drug indication when it exists', async () => {
      const mockDrugIndication = { id: '1', name: 'Indication One' };

      mockDrugIndicationModel.findById.mockResolvedValue(mockDrugIndication);

      const result = await repository.findById('1');

      expect(result).toEqual(mockDrugIndication);
      expect(mockDrugIndicationModel.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when drug indication does not exist', async () => {
      mockDrugIndicationModel.findById.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
      expect(mockDrugIndicationModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new drug indication', async () => {
      const newIndication = { name: 'New Indication' };
      const createdIndication = { id: '1', ...newIndication };

      mockDrugIndicationModel.create.mockResolvedValue(createdIndication);

      const result = await repository.create(
        newIndication as unknown as DrugIndication,
      );

      expect(result).toEqual(createdIndication);
      expect(mockDrugIndicationModel.create).toHaveBeenCalledWith(
        newIndication,
      );
    });
  });

  describe('update', () => {
    it('should update a drug indication when it exists', async () => {
      const updatedIndication = { id: '1', name: 'Updated Indication' };

      mockDrugIndicationModel.findByIdAndUpdate.mockResolvedValue(
        updatedIndication,
      );

      const result = await repository.update(
        '1',
        updatedIndication as Partial<DrugIndication>,
      );

      expect(result).toEqual(updatedIndication);
      expect(mockDrugIndicationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updatedIndication,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete a drug indication when it exists', async () => {
      mockDrugIndicationModel.findByIdAndDelete.mockResolvedValue({ id: '1' });

      const result = await repository.delete('1');

      expect(result).toEqual({ id: '1' });
      expect(mockDrugIndicationModel.findByIdAndDelete).toHaveBeenCalledWith(
        '1',
      );
    });
  });
});

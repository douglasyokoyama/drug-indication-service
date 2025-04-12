import { Test, TestingModule } from '@nestjs/testing';
import { FindUserUseCase } from './find-user.use-case';
import { User } from 'src/domain/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindUserUseCase', () => {
  let useCase: FindUserUseCase;

  const mockUser: Partial<User> = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindUserUseCase>(FindUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await useCase.execute('1');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });
  });
});

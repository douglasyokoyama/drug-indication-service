import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from './delete-user.use-case';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;

  const mockUserRepository = {
    findById: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserId = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a user when it exists', async () => {
      mockUserRepository.findById.mockResolvedValue({ id: mockUserId }); // Simulate existing user

      await useCase.execute(mockUserId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null); // Simulate non-existing user

      await expect(useCase.execute(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });
});

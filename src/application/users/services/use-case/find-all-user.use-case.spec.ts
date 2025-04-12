import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from 'src/domain/users/entities/user.entity';
import { FindAllUsersUseCase } from './find-all-user.use-case';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;

  const mockUserRepository = {
    findAll: jest.fn(),
  };

  const mockUsers: Partial<User>[] = [
    {
      id: '1',
      name: 'User One',
      email: 'userone@example.com',
      password: 'hashedPassword1',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'User Two',
      email: 'usertwo@example.com',
      password: 'hashedPassword2',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return an array of users', async () => {
      mockUserRepository.findAll.mockResolvedValue(mockUsers); // Simulate existing users

      const result = await useCase.execute();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when no users exist', async () => {
      mockUserRepository.findAll.mockResolvedValue([]); // Simulate no users

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
  });
});

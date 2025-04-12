import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/application/users/dto/create-user.dto';
import { User, UserRole } from 'src/domain/users/entities/user.entity';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  const mockUserRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockUserDto: CreateUserDto = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  const mockExistingUser: Partial<User> = {
    id: '1',
    name: 'Existing User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a user when it does not exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null); // Simulate no existing user

      const result = await useCase.execute(mockUserDto);

      expect(result).toEqual(mockUserDto);
      expect(mockUserRepository.create).toHaveBeenCalledWith(mockUserDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockExistingUser); // Simulate existing user

      await expect(useCase.execute(mockUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});

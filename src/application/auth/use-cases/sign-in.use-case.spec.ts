import { Test, TestingModule } from '@nestjs/testing';
import { SignInUseCase } from './sign-in.use-case';
import { User } from 'src/domain/users/entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { UserRole } from 'src/domain/users/entities/user.entity';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;

  const mockUser: Partial<User> = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<SignInUseCase>(SignInUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new user when email is not in use', async () => {
      const signInDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(mockUser);
      jest
        .spyOn(useCase as any, 'hashPassword')
        .mockResolvedValue('hashedPassword');

      const result = await useCase.execute(signInDto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        signInDto.email,
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: signInDto.name,
          email: signInDto.email,
          password: 'hashedPassword',
          role: UserRole.USER,
        }),
      );
    });

    it('should throw ConflictException when email is already in use', async () => {
      const signInDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(useCase.execute(signInDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        signInDto.email,
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});

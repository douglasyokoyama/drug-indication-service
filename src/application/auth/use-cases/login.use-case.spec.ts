import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { User, UserRole } from 'src/domain/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const JWT_SERVICE = 'JWT_SERVICE';
export const CONFIG_SERVICE = 'CONFIG_SERVICE';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const mockUser: Partial<User> = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
  };

  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockToken'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_EXPIRATION_TIME') {
        return '1h';
      }
      return 'secret';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
        {
          provide: 'JWT_SERVICE',
          useValue: mockJwtService,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return token and user data when credentials are valid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(useCase as any, 'comparePasswords').mockResolvedValue(true);

      const result = await useCase.execute(loginDto);

      expect(result).toEqual({
        access_token: 'mockToken',
        user: {
          id: mockUser._id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockUser._id,
          email: mockUser.email,
          role: mockUser.role,
        },
        {
          secret: 'secret',
          expiresIn: '1h',
        },
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(useCase as any, 'comparePasswords').mockResolvedValue(false);

      await expect(useCase.execute(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

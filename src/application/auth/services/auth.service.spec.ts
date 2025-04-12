import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { SignInUseCase } from 'src/application/auth/use-cases/sign-in.use-case';
import { UserDocument, UserRole } from 'src/domain/users/entities/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: Partial<UserDocument> = {
    _id: new Types.ObjectId(),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findByEmail: jest.fn((email: string) => {
      if (email === mockUser.email) {
        return mockUser;
      }
      return null;
    }),
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
        AuthService,
        LoginUseCase,
        SignInUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
        {
          provide: 'JWT_SERVICE',
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(loginDto);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(mockUserRepository, 'findByEmail')
        .mockResolvedValue(null as never);

      await expect(service.validateUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const result = await service.login(mockUser as UserDocument);

      expect(result).toEqual({
        access_token: 'mockToken',
        user: {
          id: mockUser._id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });
  });
});

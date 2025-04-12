import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/domain/users/entities/user.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      const context = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest
            .fn()
            .mockReturnValue({ user: { role: UserRole.USER } }),
        }),
      } as unknown as ExecutionContext;

      mockReflector.get.mockReturnValue(undefined);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockReflector.get).toHaveBeenCalledWith(
        'roles',
        context.getHandler(),
      );
    });

    it('should return true when user has required role', () => {
      const context = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest
            .fn()
            .mockReturnValue({ user: { role: UserRole.ADMIN } }),
        }),
      } as unknown as ExecutionContext;

      mockReflector.get.mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const context = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest
            .fn()
            .mockReturnValue({ user: { role: UserRole.USER } }),
        }),
      } as unknown as ExecutionContext;

      mockReflector.get.mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});

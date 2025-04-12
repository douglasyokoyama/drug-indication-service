import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from 'src/domain/users/entities/user.entity';
import { CreateUserDto } from 'src/application/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/application/users/dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/users/services/use-case/create-user.use-case';
import { FindUserUseCase } from 'src/application/users/services/use-case/find-user.use-case';
import { FindAllUsersUseCase } from 'src/application/users/services/use-case/find-all-user.use-case';
import { UpdateUserUseCase } from 'src/application/users/services/use-case/update-user.use-case';
import { DeleteUserUseCase } from 'src/application/users/services/use-case/delete-user.use-case';

describe('UserService', () => {
  let service: UserService;
  let createUserUseCase: CreateUserUseCase;
  let findUserUseCase: FindUserUseCase;
  let findAllUsersUseCase: FindAllUsersUseCase;
  let updateUserUseCase: UpdateUserUseCase;
  let deleteUserUseCase: DeleteUserUseCase;

  const mockUser: Partial<User> = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllUsersUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    findUserUseCase = module.get<FindUserUseCase>(FindUserUseCase);
    findAllUsersUseCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const spy = jest
        .spyOn(createUserUseCase, 'execute')
        .mockResolvedValue(mockUser as User);
      const result = await service.create(createUserDto);
      expect(spy).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(createUserUseCase, 'execute')
        .mockRejectedValue(new ConflictException('Email already in use'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const spy = jest
        .spyOn(findUserUseCase, 'execute')
        .mockResolvedValue(mockUser as User);
      const result = await service.findOne('1');
      expect(spy).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest
        .spyOn(findUserUseCase, 'execute')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const spy = jest
        .spyOn(findAllUsersUseCase, 'execute')
        .mockImplementation(() => Promise.resolve([mockUser as User]));
      const result = await service.findAll();
      expect(spy).toHaveBeenCalledWith();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const spy = jest
        .spyOn(updateUserUseCase, 'execute')
        .mockResolvedValue(mockUser as User);
      const result = await service.update('1', updateUserDto);
      expect(spy).toHaveBeenCalledWith({ id: '1', data: updateUserDto });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      jest
        .spyOn(updateUserUseCase, 'execute')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const spy = jest
        .spyOn(deleteUserUseCase, 'execute')
        .mockImplementation(() => Promise.resolve());
      await service.remove('1');
      expect(spy).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user not found', async () => {
      jest
        .spyOn(deleteUserUseCase, 'execute')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});

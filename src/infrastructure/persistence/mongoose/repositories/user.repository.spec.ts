import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserDocument } from 'src/domain/users/entities/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', name: 'User One', email: 'userone@example.com' },
        { id: '2', name: 'User Two', email: 'usertwo@example.com' },
      ];

      mockUserModel.find.mockResolvedValue(mockUsers);

      const result = await repository.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user when it exists', async () => {
      const mockUser = {
        id: '1',
        name: 'User One',
        email: 'userone@example.com',
      };

      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await repository.findById('1');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when user does not exist', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'New User', email: 'newuser@example.com' };
      const createdUser = { id: '1', ...newUser };

      mockUserModel.create.mockResolvedValue(createdUser);

      const result = await repository.save(newUser as UserDocument);

      expect(result).toEqual(createdUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe('update', () => {
    it('should update a user when it exists', async () => {
      const updatedUser = { id: '1', name: 'Updated User' };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await repository.update(
        '1',
        updatedUser as Partial<UserDocument>,
      );

      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updatedUser,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete a user when it exists', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue({ id: '1' });

      const result = await repository.delete('1');

      expect(result).toEqual({ id: '1' });
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});

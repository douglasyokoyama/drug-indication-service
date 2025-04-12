import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from './use-case/create-user.use-case';
import { FindUserUseCase } from './use-case/find-user.use-case';
import { FindAllUsersUseCase } from './use-case/find-all-user.use-case';
import { UpdateUserUseCase } from './use-case/update-user.use-case';
import { DeleteUserUseCase } from './use-case/delete-user.use-case';
import { User } from 'src/domain/users/entities/user.entity';
import { CreateUserDto } from 'src/application/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/application/users/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(createUserDto);
  }

  async findOne(id: string): Promise<User> {
    return this.findUserUseCase.execute(id);
  }

  async findAll(): Promise<User[]> {
    return this.findAllUsersUseCase.execute();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.updateUserUseCase.execute({ id, data: updateUserDto });
  }

  async remove(id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}

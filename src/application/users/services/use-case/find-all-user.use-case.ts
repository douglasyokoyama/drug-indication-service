import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/users/entities/user.entity';
import { IUserRepository } from 'src/domain/users/repositories/user.repository.interface';
import { IUseCase } from '../../../../shared/use-cases/base.use-case';

@Injectable()
export class FindAllUsersUseCase implements IUseCase<void, User[]> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

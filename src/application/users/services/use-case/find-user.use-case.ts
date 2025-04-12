import { Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from '../../../../shared/use-cases/base.use-case';
import { IUserRepository } from 'src/domain/users/repositories/user.repository.interface';
import { User } from 'src/domain/users/entities/user.entity';

@Injectable()
export class FindUserUseCase implements IUseCase<string, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}

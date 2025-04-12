import { Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from '../../../../shared/use-cases/base.use-case';
import { IUserRepository } from '../../../../domain/users/repositories/user.repository.interface';

@Injectable()
export class DeleteUserUseCase implements IUseCase<string, void> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.softDelete(id);
  }
}

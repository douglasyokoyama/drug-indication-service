import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IUseCase } from '../../../../shared/use-cases/base.use-case';
import { IUserRepository } from '../../../../domain/users/repositories/user.repository.interface';
import { User } from '../../../../domain/users/entities/user.entity';
import { UpdateUserDto } from '../../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

interface UpdateUserInput {
  id: string;
  data: UpdateUserDto;
}

@Injectable()
export class UpdateUserUseCase implements IUseCase<UpdateUserInput, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ id, data }: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
      user.email = data.email;
    }

    if (data.name) {
      user.name = data.name;
    }

    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    return this.userRepository.save(user);
  }
}

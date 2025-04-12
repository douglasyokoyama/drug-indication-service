import { Injectable, ConflictException } from '@nestjs/common';
import { IUseCase } from '../../../../shared/use-cases/base.use-case';
import { IUserRepository } from '../../../../domain/users/repositories/user.repository.interface';
import { User } from '../../../../domain/users/entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase implements IUseCase<CreateUserDto, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = new User();
    user.name = input.name;
    user.email = input.email;
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }
}

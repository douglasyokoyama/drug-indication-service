import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from 'src/application/users/users.module';
import { User, UserRole } from 'src/domain/users/entities/user.entity';
import { IUserRepository } from 'src/domain/users/repositories/user.repository.interface';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(signInDto: SignInDto): Promise<User> {
    await this.validateEmail(signInDto.email);
    const hashedPassword = await this.hashPassword(signInDto.password);
    return this.userRepository.save({
      name: signInDto.name,
      email: signInDto.email,
      password: hashedPassword,
      role: UserRole.USER,
    });
  }

  private async validateEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}

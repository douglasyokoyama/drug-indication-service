import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Document, Types } from 'mongoose';
import { USER_REPOSITORY } from 'src/application/users/users.module';
import { User } from 'src/domain/users/entities/user.entity';
import { IUserRepository } from 'src/domain/users/repositories/user.repository.interface';
import { LoginDto } from '../dto/login.dto';

interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface JwtConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
}

interface JwtSignOptions {
  secret: string;
  expiresIn: string;
}

export interface IJwtService {
  signAsync(payload: JwtPayload, options: JwtSignOptions): Promise<string>;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject('JWT_SERVICE') private readonly jwtService: IJwtService,
    private readonly configService: ConfigService<JwtConfig>,
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user as UserDocument);
  }

  private async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePasswords(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async generateToken(user: UserDocument): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const options: JwtSignOptions = {
      secret,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME', '1h')!,
    };

    const token = await this.jwtService.signAsync(payload, options);

    return {
      access_token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}

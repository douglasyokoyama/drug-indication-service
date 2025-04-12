import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/users/repositories/user.repository.interface';
import { User, UserDocument } from '../../../domain/users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export const JWT_SERVICE = 'JWT_SERVICE';

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

interface IJwtService {
  signAsync(
    payload: JwtPayload,
    options: { secret: string; expiresIn: string },
  ): Promise<string>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly configService: ConfigService<JwtConfig>,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: UserDocument): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET')!,
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME', '1h'),
    });

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

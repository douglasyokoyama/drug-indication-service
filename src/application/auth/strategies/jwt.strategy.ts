import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../domain/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { USER_REPOSITORY } from 'src/application/users/users.module';

export const JWT_STRATEGY = 'JWT_STRATEGY';

interface JwtConfig {
  JWT_SECRET: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: any,
    private readonly configService: ConfigService<JwtConfig>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<User> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '../../presentation/rest/auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/application/users/users.module';
import { AuthService } from 'src/application/auth/services/auth.service';

interface JwtConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
}

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<JwtConfig>) => ({
        secret: configService.get('JWT_SECRET')!,
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME', '1h')!,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginUseCase,
    SignInUseCase,
    JwtStrategy,
    {
      provide: 'JWT_SERVICE',
      useExisting: JwtService,
    },
  ],
  exports: [LoginUseCase, SignInUseCase],
})
export class AuthModule {}

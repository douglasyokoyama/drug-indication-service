import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { SignInUseCase } from '../../application/auth/use-cases/sign-in.use-case';
import { LoginDto } from '../../application/auth/dto/login.dto';
import { SignInDto } from '../../application/auth/dto/sign-in.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponse } from '../../application/auth/services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.loginUseCase.execute(loginDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async signIn(@Body() signInDto: SignInDto) {
    return this.signInUseCase.execute(signInDto);
  }
}

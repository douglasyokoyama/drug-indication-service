import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './application/auth/auth.module';
import { UsersModule } from './application/users/users.module';
import { DrugIndicationsModule } from './application/drug-indications/drug-indications.module';

interface DatabaseConfig {
  uri: string;
}

interface EnvironmentVariables {
  MONGODB_URI: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService<EnvironmentVariables>,
      ): DatabaseConfig => ({
        uri:
          configService.get('MONGODB_URI') ?? 'mongodb://localhost:27017/nest',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DrugIndicationsModule,
  ],
})
export class AppModule {}

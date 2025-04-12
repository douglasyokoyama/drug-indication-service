import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserUseCase } from 'src/application/users/services/use-case/create-user.use-case';
import { FindUserUseCase } from 'src/application/users/services/use-case/find-user.use-case';
import { FindAllUsersUseCase } from 'src/application/users/services/use-case/find-all-user.use-case';
import { UpdateUserUseCase } from 'src/application/users/services/use-case/update-user.use-case';
import { DeleteUserUseCase } from 'src/application/users/services/use-case/delete-user.use-case';
import { UserSchema } from 'src/domain/users/entities/user.entity';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/infrastructure/persistence/mongoose/repositories/user.repository';
import { UsersController } from 'src/presentation/rest/user.controller';

export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'users',
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}

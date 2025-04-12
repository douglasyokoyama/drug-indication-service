import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/users/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Document, Types } from 'mongoose';

interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

@Injectable()
export class UserMapper {
  toEntity(createUserDto: CreateUserDto): Partial<User> {
    return {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    };
  }

  toDto(user: UserDocument): Partial<User> {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

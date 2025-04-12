import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../../../domain/users/entities/user.entity';
import { IUserRepository } from '../../../../domain/users/repositories/user.repository.interface';

interface MongoError extends Error {
  code?: number;
}

interface UserWithId extends Partial<User> {
  _id: string | Types.ObjectId;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    public readonly model: Model<User>,
  ) {}

  async save(user: UserWithId): Promise<User> {
    try {
      if (user._id) {
        const userId = new Types.ObjectId(user._id.toString());
        const updatedUser = await this.model
          .findByIdAndUpdate(userId, user, { new: true })
          .exec();

        if (!updatedUser) {
          throw new NotFoundException(
            `User with ID ${userId.toString()} not found`,
          );
        }

        return updatedUser;
      }

      const newUser = new this.model(user);
      return newUser.save();
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError.code === 11000) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.model.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email }).select('+password').exec();
  }

  async findAll(): Promise<User[]> {
    return this.model.find({ deletedAt: null }).exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.model
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}

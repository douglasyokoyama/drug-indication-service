import { Model } from 'mongoose';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  model: Model<User>;

  save(user: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}

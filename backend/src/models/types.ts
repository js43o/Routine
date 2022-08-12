import { Model, Document } from 'mongoose';
import { Exercise, User } from '../../../frontend/src/types';

export interface IUserDocument extends User, Document {
  hashedPassword: string;
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => string;
  generateToken: () => string;
}

export interface IUserModel extends Model<IUserDocument> {
  findByUsername: (username: string) => Promise<IUserDocument>;
}

export interface IExerciseDocument extends Exercise, Document {}

export interface IExerciseModel extends Model<IExerciseDocument> {
  findByName: (name: string) => Promise<IExerciseDocument>;
}

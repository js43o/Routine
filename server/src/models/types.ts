import { Model, Document } from 'mongoose';
import { User } from '../../../src/modules/user';

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

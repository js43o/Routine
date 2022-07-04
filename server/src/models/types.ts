import { Model, Document } from 'mongoose';

export interface ExerciseItem {
  exercise: string;
  weight: number;
  numberOfTimes: number;
  numberOfSets: number;
}

export interface Routine {
  routineId: string;
  title: string;
  weekRoutine: [
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
  ];
}

interface IUser {
  username: string;
  hashedPassword: string;
  name: string;
  gender: string;
  birth: string;
  height: number;
  currentRoutine: Routine | null;
  routine: Routine[];
  completes: {
    date: string;
    list: ExerciseItem[];
    memo: string;
  }[];
  progress: {
    weight: {
      x: string;
      y: number;
    }[];
    muscleMass: {
      x: string;
      y: number;
    }[];
    fatMass: {
      x: string;
      y: number;
    }[];
  };
}

export interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => string;
  generateToken: () => string;
}

export interface IUserModel extends Model<IUserDocument> {
  findByUsername: (username: string) => Promise<IUserDocument>;
}

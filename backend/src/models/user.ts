import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserDocument, IUserModel } from './types';

const ExerciseItemSchema = new Schema({
  exercise: String,
  weight: Number,
  numberOfTimes: Number,
  numberOfSets: Number,
});

const RoutineSchema = new Schema({
  routineId: String,
  title: String,
  lastModified: Number,
  weekRoutine: [[ExerciseItemSchema]],
});

const CompleteSchema = new Schema({
  date: String,
  list: [ExerciseItemSchema],
  memo: String,
});

const ProgressSchema = new Schema({
  id: String,
  data: [
    {
      x: String,
      y: Number,
    },
  ],
});

const UserSchema: Schema<IUserDocument> = new Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, default: '' },
  snsProvider: { type: String, default: '' },
  nickname: { type: String, default: '' },
  intro: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  currentRoutineId: { type: String, default: '' },
  routines: [RoutineSchema],
  completes: [CompleteSchema],
  progress: {
    type: [ProgressSchema],
    default: [
      { id: 'weight', data: [] },
      { id: 'muscleMass', data: [] },
      { id: 'fatMass', data: [] },
    ],
  },
});

UserSchema.methods.setPassword = async function (password: string) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialize = function () {
  const json = JSON.parse(
    JSON.stringify(
      this.toJSON({
        flattenMaps: false,
      }),
    ),
  );
  const data: any = {};
  for (const key in json) {
    if (key === 'hashedPassword') continue;
    data[key] = json[key];
  }
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '3d',
    },
  );
  return token;
};

UserSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};

export default mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

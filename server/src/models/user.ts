import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserDocument, IUserModel } from './types';

const ExerciseSchema = new Schema({
  exercise: String,
  weight: Number,
  numberOfTimes: Number,
  numberOfSets: Number,
});

const RoutineSchema = new Schema({
  routineId: String,
  title: String,
  weekRoutine: [[ExerciseSchema]],
});

const ProgressSchema = new Schema({
  x: String,
  y: Number,
});

const UserSchema: Schema<IUserDocument> = new Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birth: { type: String, required: true },
  height: { type: Number, required: true },
  currentRoutine: RoutineSchema,
  routine: [RoutineSchema],
  completes: [
    {
      date: String,
      list: [ExerciseSchema],
      memo: String,
    },
  ],
  progress: {
    weight: [ProgressSchema],
    muscleMass: [ProgressSchema],
    fatMass: [ProgressSchema],
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

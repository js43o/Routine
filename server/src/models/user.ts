import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface ExerciseItem {
  exercise: string;
  weight: number;
  numberOfTimes: number;
  numberOfSets: number;
}

const ExerciseSchema = new Schema({
  exercise: String,
  weight: Number,
  numberOfTimes: Number,
  numberOfSets: Number,
});

interface Routine {
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

const RoutineSchema = new Schema({
  routineId: String,
  title: String,
  weekRoutine: [[ExerciseSchema]],
});

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
    id: string;
    data: {
      x: string;
      y: number;
    }[];
  }[];
}

interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => string;
  generateToken: () => string;
}

interface IUserModel extends Model<IUserDocument> {
  findByUsername: (username: string) => Promise<IUserDocument>;
}

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
  progress: [
    {
      id: String,
      data: [
        {
          x: String,
          y: String,
        },
      ],
    },
  ],
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

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
export default User;

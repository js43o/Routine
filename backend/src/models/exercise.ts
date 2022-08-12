import mongoose, { Schema } from 'mongoose';
import { IExerciseDocument, IExerciseModel } from './types';

const ExerciseSchema = new Schema<IExerciseDocument>({
  name: String,
  category: String,
  part: String,
});

ExerciseSchema.statics.findByName = function (name: string) {
  return this.findOne({ name });
};

export default mongoose.model<IExerciseDocument, IExerciseModel>(
  'Exercise',
  ExerciseSchema,
);

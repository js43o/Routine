import { DefaultContext } from 'koa';
import exerciseData from '../../data/exercise.json';

export const getExercises = async (ctx: DefaultContext) => {
  try {
    ctx.body = Object.values(exerciseData);
  } catch (e) {
    ctx.throw(500, e);
  }
};

import { DefaultContext } from 'koa';
import Joi from 'joi';
import Exercise from '../../models/exercise';

export const findExerciseByName = async (ctx: DefaultContext) => {
  const { name } = ctx.params;
  try {
    const exercise = await Exercise.findByName(name);
    if (!exercise) {
      ctx.status = 404;
      return;
    }
    return exercise;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const getExercises = async (ctx: DefaultContext) => {
  const page = parseInt(ctx.query.page || '1', 10);
  const { category } = ctx.query;

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const query = {
    ...(category && category !== 'all' ? { category: category } : {}),
  };
  try {
    const exercises = await Exercise.find(query)
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const exercisesCount = await Exercise.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(exercisesCount / 10));
    ctx.body = exercises;
  } catch (e) {
    ctx.throw(500, e);
  }
};

import { DefaultContext } from 'koa';
import Joi from 'joi';
import User from '../../models/user';

const exerciseSchema = Joi.object().keys({
  exercise: Joi.string().required(),
  weight: Joi.number().min(1),
  numberOfTimes: Joi.number().min(1),
  numberOfSets: Joi.number().min(1).max(20),
  _id: Joi.string(),
});

const RoutineSchema = Joi.object().keys({
  routineId: Joi.string().required(),
  title: Joi.string().required(),
  lastModified: Joi.number().required(),
  weekRoutine: Joi.array().items(Joi.array().items(exerciseSchema)),
  _id: Joi.string(),
});

export const addRoutine = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    routine: RoutineSchema,
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, routine } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    user.routines.push(routine);
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const removeRoutine = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    routineId: Joi.string().required(),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, routineId } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    user.routines = user.routines.filter(
      (item) => item.routineId !== routineId,
    );
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const editRoutine = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    routine: RoutineSchema,
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    console.log(result.error.message);
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    username,
    routine: { routineId, title, lastModified, weekRoutine },
  } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    user.routines = user.routines.map((item) =>
      item.routineId === routineId
        ? {
            routineId,
            title,
            lastModified,
            weekRoutine,
          }
        : item,
    );
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

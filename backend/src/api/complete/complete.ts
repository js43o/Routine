import { DefaultContext } from 'koa';
import Joi from 'joi';
import User from '../../models/user';

export const addComplete = async (ctx: DefaultContext) => {
  const exerciseSchema = Joi.object().keys({
    exercise: Joi.string().required(),
    weight: Joi.number().min(1),
    numberOfTimes: Joi.number().min(1),
    numberOfSets: Joi.number().min(1).max(20),
    _id: Joi.string(),
  });

  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    complete: Joi.object().keys({
      date: Joi.string(),
      list: Joi.array().items(exerciseSchema),
      memo: Joi.string().allow(''),
    }),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, complete } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 404;
      return;
    }
    user.completes.push(complete);
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const removeComplete = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    date: Joi.string().required(),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, date } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 404;
      return;
    }

    user.completes = user.completes.filter((item) => item.date !== date);
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

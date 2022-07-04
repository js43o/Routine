import { DefaultContext } from 'koa';
import Joi from 'joi';
import User from '../../models/user';

export const addPerform = async (ctx: DefaultContext) => {
  const exerciseSchema = Joi.object().keys({
    exercise: Joi.string().required(),
    weight: Joi.number().min(1),
    numberOfTimes: Joi.number().min(1),
    numberOfSets: Joi.number().min(1).max(20),
  });

  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    perform: Joi.object().keys({
      date: Joi.string(),
      list: Joi.array().items(exerciseSchema),
      memo: Joi.string(),
    }),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, perform } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    user.completes.push(perform);
    await user.save();
    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const removePerform = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    performDate: Joi.string().required(),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, performDate } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    user.completes = user.completes.filter((item) => item.date !== performDate);
    await user.save();
    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

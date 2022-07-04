import { DefaultContext } from 'koa';
import Joi from 'joi';
import User from '../../models/user';

export const addProgress = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    progress: Joi.array().items(
      Joi.object().keys({
        x: Joi.string().required(),
        y: Joi.number().required(),
      }),
    ),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, progress } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    user.progress.weight.push(progress[0]);
    user.progress.muscleMass.push(progress[1]);
    user.progress.fatMass.push(progress[2]);
    await user.save();
    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const removeProgress = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    progressDate: Joi.string().required(),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, progressDate } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    user.progress.weight = user.progress.weight.filter(
      (item) => item.x !== progressDate,
    );
    user.progress.muscleMass = user.progress.muscleMass.filter(
      (item) => item.x !== progressDate,
    );
    user.progress.fatMass = user.progress.fatMass.filter(
      (item) => item.x !== progressDate,
    );
    await user.save();
    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

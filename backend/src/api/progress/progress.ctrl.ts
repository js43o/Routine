import { DefaultContext } from 'koa';
import Joi from 'joi';
import User from '../../models/user';
import { ProgressItem } from '../../../../frontend/src/types';

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
    user.progress[0].data.push(progress[0]);
    user.progress[1].data.push(progress[1]);
    user.progress[2].data.push(progress[2]);
    await user.save();
    ctx.status = 200;
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

    user.progress[0].data = user.progress[0].data.filter(
      (item) => item.x !== progressDate,
    );
    user.progress[1].data = user.progress[1].data.filter(
      (item) => item.x !== progressDate,
    );
    user.progress[2].data = user.progress[2].data.filter(
      (item) => item.x !== progressDate,
    );
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const setProgress = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    progress: Joi.array().items(
      Joi.array().items(
        Joi.object().keys({
          x: Joi.string().required(),
          y: Joi.number().required(),
        }),
      ),
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

    user.progress[0].data = (progress as ProgressItem[]).map((p) => p.data[0]);
    user.progress[1].data = (progress as ProgressItem[]).map((p) => p.data[1]);
    user.progress[2].data = (progress as ProgressItem[]).map((p) => p.data[2]);
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

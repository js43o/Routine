import { DefaultContext } from 'koa';
import Joi from 'joi';
import User from '../../models/user';

export const register = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(20).required(),
    password: Joi.string().min(8).max(20).required(),
    nickname: Joi.string().min(1).max(10).required(),
  });
  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password, nickname } = ctx.request.body;
  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409;
      return;
    }

    const user = new User({
      username,
      nickname,
    });
    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const login = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(20).required(),
    password: Joi.string().required(),
  });
  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const check = async (ctx: DefaultContext) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.status = 200;
  ctx.body = user;
};

export const logout = async (ctx: DefaultContext) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};

export const setInfo = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(20).required(),
    nickname: Joi.string().min(1).max(10).required(),
    intro: Joi.string().allow(''),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, nickname, intro } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    user.nickname = nickname;
    user.intro = intro;
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const setCurrentRoutine = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(20).required(),
    routineId: Joi.string().allow(''),
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
    user.currentRoutineId = routineId;
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

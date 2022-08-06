import { DefaultContext } from 'koa';
import Joi from 'joi';
import User from '../../models/user';

const USERNAME_SCHEMA = Joi.string().alphanum().min(5).max(20).required();
const PASSWORD_SCHEMA = Joi.string().min(8).max(20).required();
const NICKNAME_SCHEMA = Joi.string().min(1).max(10).required();

export const register = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: USERNAME_SCHEMA,
    password: PASSWORD_SCHEMA,
    nickname: NICKNAME_SCHEMA,
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
    username: USERNAME_SCHEMA,
    password: PASSWORD_SCHEMA,
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

export const logout = async (ctx: DefaultContext) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};

export const deregister = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: USERNAME_SCHEMA,
  });
  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 404;
      return;
    }
    User.findByIdAndDelete(user._id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

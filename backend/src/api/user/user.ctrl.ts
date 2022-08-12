import { DefaultContext } from 'koa';
import multer from '@koa/multer';
import Joi from 'joi';
import User from '../../models/user';
import path from 'path';
import fs from 'fs';

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

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
});

export const setProfileImageSrc = async (ctx: DefaultContext) => {
  const inputSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(20).required(),
    src: Joi.string().allow(''),
  });

  const result = inputSchema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, src } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const exists = path.resolve(
      __dirname + `/../../../uploads/${path.basename(user.profileImage)}`,
    );
    if (fs.existsSync(exists)) fs.unlinkSync(exists);
    user.profileImage = src;
    await user.save();
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

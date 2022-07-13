import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Context } from 'koa';

interface Decoded extends jwt.JwtPayload {
  _id: string;
  username: string;
  lat: number;
  exp: number;
}

const jwtMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Decoded;
    ctx.state.user = decoded.username;
    // 현재 토큰의 유효기간이 3.5일보다 적을 경우, 토큰 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      const token = user?.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;

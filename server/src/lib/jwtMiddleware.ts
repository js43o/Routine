import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Context, Next } from 'koa';
import { refreshKakaoToken } from '../api/auth/kakao.ctrl';
import { removeAllToken } from '../api/auth/kakao.ctrl';

interface Decoded extends jwt.JwtPayload {
  _id: string;
  username: string;
  lat: number;
  exp: number;
}

const jwtMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();

  const kakao_expires_in = ctx.cookies.get('kakao_expires_in');
  const kakao_refresh_token = ctx.cookies.get('kakao_refresh_token');
  const kakao_refresh_token_expires_in = ctx.cookies.get(
    'kakao_refresh_token_expires_in',
  );

  if (kakao_expires_in && Date.now() > +kakao_expires_in) {
    // 카카오로 로그인했고 액세스 토큰이 만료되었을 때
    if (
      kakao_refresh_token &&
      kakao_refresh_token_expires_in &&
      Date.now() < +kakao_refresh_token_expires_in
    ) {
      // 만약 리프레쉬 토큰이 만료되지 않았다면 토큰 갱신 요청
      await refreshKakaoToken(ctx, kakao_refresh_token);
    } else {
      // 리프레쉬 토큰도 만료된 경우
      removeAllToken(ctx);
      return next();
    }
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Decoded;
    ctx.state.user = decoded.username;
    // 현재 토큰의 유효기간이 3.5일보다 적을 경우, 토큰 재발급
    const now = Math.floor(Date.now() / 1000);
    const user = await User.findById(decoded._id);
    if (user && decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const token = user.generateToken();
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

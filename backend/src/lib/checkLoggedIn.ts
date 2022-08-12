import { Context } from 'koa';

const checkLoggedIn = (ctx: Context, next: () => Promise<void>) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    ctx.message = 'TOKEN_EXPIRED'; // 토큰 만료의 경우 따로 알림
    return;
  }
  return next();
};

export default checkLoggedIn;

import { DefaultContext } from 'koa';
import axios from 'axios';
import User from '../../models/user';

export const kakaoLogin = async (ctx: DefaultContext) => {
  const { code } = ctx.request.body;
  try {
    const {
      access_token,
      expires_in,
      refresh_token,
      refresh_token_expires_in,
    } = await getKakaoToken(code);
    const id = await getKakaoInfo(access_token);

    let user = await User.findByUsername(id);
    if (!user) {
      user = new User({
        username: id,
        snsProvider: 'kakao',
        nickname: `사용자-${id}`.slice(0, 10),
      });
      await user.save();
    }
    ctx.body = user.serialize();

    ctx.cookies.set('kakao_access_token', access_token);
    ctx.cookies.set('kakao_expires_in', Date.now() + expires_in * 1000);
    ctx.cookies.set('kakao_refresh_token', refresh_token);
    ctx.cookies.set(
      'kakao_refresh_token_expires_in',
      Date.now() + refresh_token_expires_in * 1000,
    );

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

const getKakaoToken = async (code: string) => {
  const { KAKAO_API } = process.env;
  const url = 'https://kauth.kakao.com/oauth/token';
  const params = {
    grant_type: 'authorization_code',
    client_id: KAKAO_API,
    redirect_uri: 'http://localhost:3000/fitness-app/auth/kakao/redirect',
    code,
  };
  try {
    const response = await axios.post(url, null, {
      params,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    return response.data;
  } catch (e) {
    console.error(e as Error);
  }
};

const getKakaoInfo = async (token: string) => {
  const url = 'https://kapi.kakao.com/v1/user/access_token_info';
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(url, config);
    const { id } = response.data;

    return id;
  } catch (e) {
    console.error(e as Error);
  }
};

const kakaoQuit = async (ctx: DefaultContext, type: 'logout' | 'unlink') => {
  const access_token = ctx.cookies.get('kakao_access_token');
  if (!access_token) {
    ctx.status = 401;
    return;
  }
  const url = `https://kapi.kakao.com/v1/user/${type}`;
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    await axios.post(url, null, config);
    removeAllToken(ctx);

    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e as Error);
  }
};

export const removeAllToken = (ctx: DefaultContext) => {
  ctx.cookies.set('kakao_access_token');
  ctx.cookies.set('kakao_expires_in');
  ctx.cookies.set('kakao_refresh_token');
  ctx.cookies.set('kakao_refresh_token_expires_in');
  // 로컬 토큰도 만료시킴
  ctx.cookies.set('access_token');
};

export const refreshKakaoToken = async (ctx: DefaultContext, token: string) => {
  const { KAKAO_API } = process.env;
  const url = 'https://kauth.kakao.com/oauth/token';
  const params = {
    grant_type: 'refresh_token',
    client_id: KAKAO_API,
    refresh_token: token,
  };
  try {
    const response = await axios.post(url, null, {
      params,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const {
      access_token,
      expires_in,
      refresh_token,
      refresh_token_expires_in,
    } = response.data;

    // 액세스 토큰 갱신
    ctx.cookies.set('kakao_access_token', access_token);
    ctx.cookies.set('kakao_expires_in', Date.now() + expires_in * 1000);

    // 만약 새로운 리프레쉬 토큰이 발급된 경우 리프레쉬 토큰도 갱신
    if (refresh_token) {
      ctx.cookies.set('kakao_refresh_token', refresh_token);
      ctx.cookies.set(
        'kakao_refresh_token_expires_in',
        Date.now() + refresh_token_expires_in * 1000,
      );
    }
  } catch (e) {
    console.error(e as Error);
  }
};

export const kakaoLogout = async (ctx: DefaultContext) =>
  kakaoQuit(ctx, 'logout');

export const kakaoDeregister = async (ctx: DefaultContext) =>
  kakaoQuit(ctx, 'unlink');

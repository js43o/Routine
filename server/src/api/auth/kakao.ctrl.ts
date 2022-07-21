import { DefaultContext } from 'koa';
import User from '../../models/user';
import axios from 'axios';

export const kakaoLogin = async (ctx: DefaultContext) => {
  const { code } = ctx.request.body;
  try {
    const access_token = await getKakaoToken(code);
    const id = await getKakaoInfo(access_token);
    const user = await User.findByUsername(id);
    if (!user) {
      const user = new User({
        username: id,
        snsProvider: 'kakao',
      });
      await user.save();
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
    const { access_token } = response.data;

    return access_token;
  } catch (e) {
    // console.error(e as Error);
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
    // console.error(e as Error);
  }
};

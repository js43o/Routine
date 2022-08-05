import Router from 'koa-router';
import * as authCtrl from './local.ctrl';
import * as kakaoCtrl from './kakao.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/logout', authCtrl.logout);
auth.post('/kakao', kakaoCtrl.kakaoLogin);

export default auth;

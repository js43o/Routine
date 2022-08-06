import Router from 'koa-router';
import * as authCtrl from './local.ctrl';
import * as kakaoCtrl from './kakao.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/logout', checkLoggedIn, authCtrl.logout);
auth.post('/deregister', checkLoggedIn, authCtrl.deregister);

auth.post('/kakao/login', kakaoCtrl.kakaoLogin);
auth.post('/kakao/logout', checkLoggedIn, kakaoCtrl.kakaoLogout);
auth.post('/kakao/deregister', checkLoggedIn, kakaoCtrl.kakaoDeregister);

export default auth;

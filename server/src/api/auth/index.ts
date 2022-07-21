import Router from 'koa-router';
import * as authCtrl from './local.ctrl';
import * as kakaoCtrl from './kakao.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);
auth.post('/set_info', authCtrl.setInfo);
auth.post('/set_current_routine', authCtrl.setCurrentRoutine);

auth.post('/kakao', kakaoCtrl.kakaoLogin);

export default auth;

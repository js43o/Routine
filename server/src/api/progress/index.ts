import Router from 'koa-router';
import * as progressCtrl from './progress.ctrl';
import checkLoggedIn from './../../lib/checkLoggedIn';

const progress = new Router();

progress.post('/add', checkLoggedIn, progressCtrl.addProgress);
progress.post('/remove', checkLoggedIn, progressCtrl.removeProgress);
progress.post('/set', checkLoggedIn, progressCtrl.setProgress);

export default progress;

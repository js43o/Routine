import Router from 'koa-router';
import * as progressCtrl from './progress.ctrl';

const progress = new Router();

progress.post('/add', progressCtrl.addProgress);
progress.post('/remove', progressCtrl.removeProgress);
progress.post('/set', progressCtrl.setProgress);

export default progress;

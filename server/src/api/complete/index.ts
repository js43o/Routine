import Router from 'koa-router';
import * as completeCtrl from './complete';

const complete = new Router();

complete.post('/add', completeCtrl.addComplete);
complete.post('/remove', completeCtrl.removeComplete);

export default complete;

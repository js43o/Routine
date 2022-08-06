import Router from 'koa-router';
import * as completeCtrl from './complete';
import checkLoggedIn from './../../lib/checkLoggedIn';

const complete = new Router();

complete.post('/add', checkLoggedIn, completeCtrl.addComplete);
complete.post('/remove', checkLoggedIn, completeCtrl.removeComplete);

export default complete;

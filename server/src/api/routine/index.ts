import Router from 'koa-router';
import * as routineCtrl from './routine.ctrl';
import checkLoggedIn from './../../lib/checkLoggedIn';

const routine = new Router();

routine.post('/add', checkLoggedIn, routineCtrl.addRoutine);
routine.post('/remove', checkLoggedIn, routineCtrl.removeRoutine);
routine.post('/edit', checkLoggedIn, routineCtrl.editRoutine);

export default routine;

import Router from 'koa-router';
import * as routineCtrl from './routine.ctrl';

const routine = new Router();

routine.post('/add', routineCtrl.addRoutine);
routine.post('/remove', routineCtrl.removeRoutine);

export default routine;

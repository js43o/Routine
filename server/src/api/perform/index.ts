import Router from 'koa-router';
import * as performCtrl from './perform.ctrl';

const perform = new Router();

perform.post('/add', performCtrl.addPerform);
perform.post('/remove', performCtrl.removePerform);

export default perform;

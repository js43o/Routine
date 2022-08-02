import Router from 'koa-router';
import auth from './auth';
import user from './user';
import routine from './routine';
import progress from './progress';
import complete from './complete';
import exercise from './exercise';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/user', user.routes());
api.use('/routine', routine.routes());
api.use('/progress', progress.routes());
api.use('/complete', complete.routes());
api.use('/exercise', exercise.routes());

export default api;

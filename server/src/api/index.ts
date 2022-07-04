import Router from 'koa-router';
import auth from './auth';
import routine from './routine';
import progress from './progress';
import perform from './perform';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/routine', routine.routes());
api.use('/progress', progress.routes());
api.use('/perform', perform.routes());

export default api;

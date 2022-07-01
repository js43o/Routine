import Router from 'koa-router';
import auth from './auth';
import routine from './routine';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/routine', routine.routes());

export default api;

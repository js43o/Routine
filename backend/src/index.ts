import 'dotenv/config';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import mongoose from 'mongoose';
import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(`${MONGO_URI}`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();
router.use('/api', api.routes());

app.use(mount('/img', serve('uploads')));

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

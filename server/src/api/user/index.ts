import Router from 'koa-router';
import * as userCtrl from './user.ctrl';
import fs from 'fs';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads folder created.');
  fs.mkdirSync('uploads');
}

const user = new Router();

user.post('/info', userCtrl.setInfo);
user.post('/curroutine', userCtrl.setCurrentRoutine);
user.post('/image', userCtrl.upload.single('image'), (ctx) => {
  ctx.body = { url: `/img/${ctx.request.file.filename}` };
});

export default user;

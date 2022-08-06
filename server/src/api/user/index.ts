import Router from 'koa-router';
import * as userCtrl from './user.ctrl';
import fs from 'fs';
import checkLoggedIn from './../../lib/checkLoggedIn';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads folder created.');
  fs.mkdirSync('uploads');
}

const user = new Router();

user.post('/info', checkLoggedIn, userCtrl.setInfo);
user.post('/curroutine', checkLoggedIn, userCtrl.setCurrentRoutine);
user.post('/image', userCtrl.upload.single('image'), (ctx) => {
  ctx.body = { url: `/img/${ctx.request.file.filename}` };
});
user.post('/curimage', checkLoggedIn, userCtrl.setProfileImageSrc);

export default user;

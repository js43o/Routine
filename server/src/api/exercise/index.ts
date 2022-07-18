import Router from 'koa-router';
import * as exerciseCtrl from '../exercise/exercise.ctrl';

const exercise = new Router();

exercise.get('/', exerciseCtrl.getExercises);

export default exercise;
